import {
  PotatoScene,
  SpriteBuilder,
  createGlobalPositionLabel,
  updateGlobalPositionLabel,
} from '@potato-golem/ui'
import Phaser from 'phaser'

import { createGlobalTrackerLabel, updateGlobalTrackerLabel } from '@potato-golem/ui'
import type { Dependencies } from '../../model/diConfig'
import { CardModel } from '../../model/entities/CardModel'
import type { WorldModel } from '../../model/state/WorldModel'
import { Scenes } from '../SceneRegistry'
import { CardView } from './views/CardView'
import Sprite = Phaser.GameObjects.Sprite
import type { CommonEntity, EventSink, EventSource } from '@potato-golem/core'
import type {
  CardDefinitionGenerator,
  CardDefinitions,
} from '../../model/definitions/cardDefinitions'
import type { EventDefinitionGenerator, EventId } from '../../model/definitions/eventDefinitions'
import type { EndTurnProcessor } from '../../model/processors/EndTurnProcessor'
import { EntityTypeRegistry } from '../../model/registries/entityTypeRegistry'
import { ImageRegistry } from '../../model/registries/imageRegistry'
import type { Zone } from '../../model/registries/zoneRegistry'
import type { MusicScene } from '../MusicScene'
import { EventView } from './views/EventView'
import EventEmitter = Phaser.Events.EventEmitter
import type { EVENT_EVENTS, SpawnCardMessage } from '../../model/activations/event/eventActivations'

export type BoardSupportedEvents =
  | typeof EVENT_EVENTS.SPAWN_CARD
  | 'CARD_HOVERED'
  | 'CARD_DRAGGED_OVER_CARD'
  | 'ZONE_HOVERED_OVER'
  | 'START_EVENT'

import { TextBuilder } from '@potato-golem/ui'
import { ChangeSceneActivation } from '@potato-golem/ui'
import { zones } from '../../model/definitions/zoneDefinitions'
import { EventDirector } from '../../model/processors/EventDirector'
import type { CardId } from '../../model/registries/cardRegistry'
import { DepthRegistry } from '../../model/registries/depthRegistry'
import { delay } from '../../utils/timeUtils'
import { CardEffectView } from './views/CardEffectView'
import { HomunculusView } from './views/HomunculusView'
import { ZoneView, type ZoneViewParams } from './views/ZoneView'

const debug = true

export class BoardScene extends PotatoScene {
  private readonly musicScene: MusicScene
  private readonly worldModel: WorldModel

  private globalPositionLabel: Phaser.GameObjects.Text
  private globalTrackerLabel: Phaser.GameObjects.Text

  private backgroundImage: Sprite

  private readonly endTurnProcessor: EndTurnProcessor
  private eventDirector!: EventDirector

  private readonly cardDefinitionGenerator: CardDefinitionGenerator
  private cardDefinitions: CardDefinitions

  private draggedCardView?: CardView = null
  private cards: CardView[] = []
  private homunculus: HomunculusView
  private eventView: EventView
  private cardEffectView: CardEffectView

  private pointedZoneView?: ZoneView
  private pointedCardView?: CardView

  private readonly eventDefinitionGenerator: EventDefinitionGenerator
  private readonly eventSink: EventSink<BoardSupportedEvents> & EventSource<BoardSupportedEvents>

  constructor({
    musicScene,
    eventDefinitionGenerator,
    cardDefinitionGenerator,
    worldModel,
    endTurnProcessor,
  }: Dependencies) {
    super(Scenes.BOARD_SCENE)

    this.musicScene = musicScene
    this.worldModel = worldModel

    this.eventDefinitionGenerator = eventDefinitionGenerator
    this.eventSink = new EventEmitter()
    this.cardDefinitions = cardDefinitionGenerator.generateDefinitions(this.eventSink)

    this.endTurnProcessor = endTurnProcessor

    this.registerListeners()
  }

  private registerListeners() {
    this.eventSink.on('spawn_card', (event: SpawnCardMessage) => {
      this.addCard(event.cardId, event.zone)
    })

    this.eventSink.on('CARD_HOVERED', (card: CardView) => {
      if (this.pointedCardView) {
        this.pointedCardView.unhighlight()
      }

      this.pointedCardView = card

      if (this.draggedCardView) {
        this.cardEffectView.showCardCombinationEffect(this.draggedCardView, this.pointedCardView)

        const canCombine =
          this.draggedCardView.model.getActivationForCombinedCard(this.pointedCardView.model) ||
          this.pointedCardView.model.getActivationForCombinedCard(this.draggedCardView.model)

        if (canCombine) {
          this.draggedCardView.highlight()
          this.pointedCardView.highlight()
        }
      }

      if (this.pointedZoneView) {
        this.pointedZoneView.unhighlight()
        this.pointedZoneView = null
      }
    })

    this.eventSink.on('START_EVENT', (eventId: EventId) => {
      this.eventView.setToEvent(eventId)
      this.eventView.show()
    })

    this.eventSink.on('ZONE_HOVERED_OVER', (zone: ZoneView) => {
      this.pointedZoneView = zone

      if (this.pointedCardView) {
        this.pointedCardView.unhighlight()
        this.pointedCardView = null
      }

      for (const zone in this.worldModel.zones) {
        this.worldModel.zones[zone].unhighlight()
      }

      // we get here in case we dragged card over a zone
      if (this.draggedCardView) {
        this.cardEffectView.showCardZoneEffect(this.draggedCardView, zone)

        // this.pointedZoneView.highlight()
        if (this.draggedCardView.model.hasActivationForZone(zone.id)) {
          this.draggedCardView.highlight()
        } else {
          this.draggedCardView.unhighlight()
        }
      }
    })
  }

  init() {
    this.eventView = new EventView(this, {
      worldModel: this.worldModel,
      eventDefinitionGenerator: this.eventDefinitionGenerator,
      boardEventSink: this.eventSink,
    })
    this.eventDirector = new EventDirector(this.eventView.eventDefinitions, this.eventSink)

    this.worldModel.homunculusModel.reset()
    this.homunculus = new HomunculusView(this, { model: this.worldModel.homunculusModel })
    this.cardEffectView = new CardEffectView(this, {
      cardDefinitions: this.cardDefinitions,
    })

    this.initZones()

    this.addCard('HEALTH', 'home')
    this.addCard('HEALTH', 'home')
    this.addCard('HEALTH', 'home')

    this.addCard('GOLD', 'home')
    this.addCard('GOLD', 'home')
    this.addCard('MERCHANT', 'streets')

    this.addCard('MEDICINE', 'lab')
    this.addCard('MEDICINE', 'lab')
    this.addCard('POISON', 'lab')
    this.addCard('POISON', 'lab')
    this.addCard('POISON', 'lab')
    this.addCard('POISON', 'lab')

    this.eventBus.on('DESTROY', (entity: CommonEntity) => {
      if (entity.type === EntityTypeRegistry.CARD) {
        this.worldModel.removeCard(entity.id)
        this.destroyChildByModelId(entity.id)
      }
    })
    this.eventBus.on('MOVE', (entity: CommonEntity, previousZone: Zone) => {
      if (entity.type === EntityTypeRegistry.CARD) {
        this.worldModel.removeCardFromZone(previousZone, entity.id)
      }
    })

    this.eventView.setToEvent('INTRO')
    this.eventView.show()
  }

  initZones() {
    this.createZone({ ...zones.alchemy, scene: this, debug })
    this.createZone({ ...zones.home, scene: this, debug })
    this.createZone({ ...zones.streets, scene: this, debug })
    this.createZone({ ...zones.lab, scene: this, debug })
    this.createZone({ ...zones.homunculus, scene: this, debug })
  }

  createZone(zoneParams: ZoneViewParams) {
    const zoneView = new ZoneView(zoneParams, { boardEventSink: this.eventSink })
    this.addChildViewObject(zoneView)
    this.worldModel.zones[zoneParams.id] = zoneView

    return zoneView
  }

  moveCardToTop(cardView: CardView) {
    this.cards.sort((a, b) => a.depth - b.depth)

    //set depth of all cards and make sure that cardView is on top
    let depthCounter = 0
    this.cards.forEach((existingCardView, index) => {
      if (existingCardView === cardView) {
        return
      }
      existingCardView.setDepth(DepthRegistry.CARD_MIN + depthCounter++)
    })
    cardView.setDepth(DepthRegistry.CARD_MIN + this.cards.length - 1)
  }

  addCard(cardId: CardId, zone: Zone) {
    const cardModel = new CardModel({
      parentEventSink: this.eventBus,
      zone: zone,
      definition: this.cardDefinitions[cardId],
    })
    this.worldModel.addCard(cardModel)

    const zoneView = this.worldModel.zones[zone]

    const cardView = new CardView(
      this,
      {
        model: cardModel,
        x: 0,
        y: 0,
        onDragStart: (cardView: CardView) => this.onCardDragStart(cardView),
        onDragEnd: (cardView: CardView) => this.onCardDragEnd(cardView),
      },
      {
        endTurnProcessor: this.endTurnProcessor,
        boardEventSink: this.eventSink,
      },
    )
    cardView.setDepth(DepthRegistry.CARD_MIN + this.cards.length)

    zoneView.addCard(cardView)
    this.cards.push(cardView)
    this.addChildViewObject(cardView)
  }

  onCardDragStart(cardView: CardView) {
    this.draggedCardView = cardView
    this.cardEffectView.show()
    if (this.pointedZoneView) {
      this.pointedZoneView.highlight()
    }
    this.moveCardToTop(cardView)
  }
  onCardDragEnd(cardView: CardView) {
    this.draggedCardView.unhighlight()
    this.draggedCardView = null
    this.cardEffectView.hide()

    let wasCardActivated = false

    // we get here if we dropped card into a zone
    if (this.pointedZoneView) {
      this.pointedZoneView.unhighlight()

      wasCardActivated = cardView.model.changeZone(this.pointedZoneView.id)

      if (wasCardActivated && this.pointedZoneView.id === 'homunculus') {
        // Every time we feed a homunculus, a day passes
        this.nextTurn()
      }
    }

    if (this.pointedCardView) {
      console.log(
        `Dropped card ${cardView.model.definition.id} at ${this.pointedCardView.model.definition.id}`,
      )
      const combinationEffect = cardView.model.getActivationForCombinedCard(
        this.pointedCardView.model,
      )

      if (combinationEffect) {
        cardView.model.combineWithCard(this.pointedCardView.model)

        if (combinationEffect.timeTillTrigger === 0) {
          combinationEffect.effect.activate(cardView.model)
        }
        wasCardActivated = true
      }
    }

    if (!wasCardActivated) {
      cardView.cancelDrag()
      this.worldModel.zones[cardView.model.zone].reorderStackedCardDepths()
    }
  }

  nextTurn() {
    this.endTurnProcessor.processTurn()
    this.eventDirector.processTurn()
  }

  async gameOver(text: string) {
    const container = new Phaser.GameObjects.Container(this)
    container.setDepth(DepthRegistry.GAME_OVER)

    const backdrop = new Phaser.GameObjects.Rectangle(this, 1280, 720, 2560, 1440, 0, 1)
    backdrop.setInteractive({
      draggable: false,
      pixelPerfect: false,
      alphaTolerance: undefined,
      useHandCursor: false,
    })
    backdrop.alpha = 0.001
    backdrop.setDepth(DepthRegistry.GAME_OVER)
    container.add(backdrop)

    const title = TextBuilder.instance(this)
      .setPosition({
        x: 1280,
        y: 720,
      })
      .setOrigin(0.5, 0.5)
      .setText(text)
      .setDisplaySize(1200, 15)
      .build()
      .value.setDepth(DepthRegistry.CARD_MIN)

    title.setFontSize(120)
    title.setColor('#FFFFFF')
    title.setAlign('center')
    title.setFontFamily('Arial')
    title.setText(title.getWrappedText().map((line) => line.trim()))
    title.setLineSpacing(20)
    title.setLetterSpacing(2)
    title.alpha = 0
    title.scaleY = 0.87

    container.add(title)

    this.add.existing(container)

    this.musicScene.playGameOver()

    this.tweens.add({
      targets: backdrop,
      alpha: 1,
      delay: 0,
      duration: 600,
      ease: 'Cubic',
    })
    this.tweens.add({
      targets: title,
      alpha: 1,
      delay: 1000,
      duration: 6000,
      ease: 'Cubic',
    })
    this.tweens.add({
      targets: title,
      scaleX: 2,
      scaleY: 0.87 * 2,
      delay: 1000,
      duration: 80000,
      ease: 'Cubic',
    })
    this.tweens.add({
      targets: title,
      alpha: 0,
      delay: 7000,
      duration: 2000,
      ease: 'Cubic',
    })
    await delay(10000)
    ChangeSceneActivation.build(this, Scenes.MAIN_MENU_SCENE)()
  }

  preload() {}

  update() {
    updateGlobalPositionLabel(this.globalPositionLabel)
    updateGlobalTrackerLabel(this.globalTrackerLabel)
  }

  create() {
    this.anims.create({
      key: 'poof',
      frames: [
        { key: ImageRegistry.CLOUD_3, duration: 40 },
        { key: ImageRegistry.CLOUD_2, duration: 40 },
        { key: ImageRegistry.CLOUD_1, duration: 40 },
        { key: ImageRegistry.CLOUD_2 },
        { key: ImageRegistry.CLOUD_3 },
        { key: ImageRegistry.CLOUD_4 },
      ],
      frameRate: 24,
    })
    this.backgroundImage = SpriteBuilder.instance(this)
      .setTextureKey(ImageRegistry.BOARD_BACKGROUND)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setDepth(DepthRegistry.BOARD_BACKGROUND)
      .setDimensions({
        width: 2560,
        height: 1440,
      })
      .build()

    this.globalPositionLabel = createGlobalPositionLabel(this)
    this.globalTrackerLabel = createGlobalTrackerLabel(this)

    this.worldModel.homunculusModel.eventSink.on('DEATH', () => {
      this.gameOver('Homunculus\nis dead')
    })
    this.musicScene.playBoardTheme()
  }
}
