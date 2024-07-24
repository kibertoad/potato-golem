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
  CardId,
} from '../../model/definitions/cardDefinitions'
import type { EventDefinitionGenerator } from '../../model/definitions/eventDefinitions'
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
import { zones } from '../../model/definitions/zoneDefinitions'
import { DepthRegistry } from '../../model/registries/depthRegistry'
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
  private readonly cardDefinitionGenerator: CardDefinitionGenerator
  private cardDefinitions: CardDefinitions

  private draggedCardView?: CardView = null
  private cards: CardView[] = []
  private homunculus: HomunculusView
  private eventView: EventView
  private cardEffectView: CardEffectView
  private zones: { string?: ZoneView } = {}

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
    this.endTurnProcessor = endTurnProcessor

    this.eventDefinitionGenerator = eventDefinitionGenerator
    this.cardDefinitions = cardDefinitionGenerator.generateDefinitions(this.eventSink)
    this.eventSink = new EventEmitter()

    this.registerListeners()
  }

  private registerListeners() {
    this.eventSink.on('spawn_card', (event: SpawnCardMessage) => {
      this.addCard(event.cardId, event.zone)
    })

    this.eventSink.on('CARD_HOVERED', (card: CardView) => {
      this.pointedCardView = card
    })

    this.eventSink.on('ZONE_HOVERED_OVER', (zone: ZoneView) => {
      this.pointedZoneView = zone

      for (const zone in this.zones) {
        this.zones[zone].unhighlight()
      }

      // we get here in case we dragged card over a zone
      if (this.draggedCardView) {
        this.cardEffectView.showCardZoneEffect(this.draggedCardView, zone)

        this.pointedZoneView.highlight()
      }
    })
  }

  init() {
    this.eventView = new EventView(this, {
      worldModel: this.worldModel,
      eventDefinitionGenerator: this.eventDefinitionGenerator,
      boardEventSink: this.eventSink,
    })
    this.homunculus = new HomunculusView(this, { model: this.worldModel.homunculusModel })
    this.cardEffectView = new CardEffectView(this, {
      cardDefinitions: this.cardDefinitions,
    })

    this.initZones()

    this.addCard('HEALTH', 'home')
    this.addCard('HEALTH', 'home')
    this.addCard('HEALTH', 'home')

    this.addCard('MEDICINE', 'lab')
    this.addCard('MEDICINE', 'lab')
    this.addCard('POISON', 'lab')
    this.addCard('POISON', 'lab')

    this.eventBus.on('DESTROY', (entity: CommonEntity) => {
      if (entity.type === EntityTypeRegistry.CARD) {
        this.worldModel.removeCard(entity.id)
        this.destroyChildByModelId(entity.id)
      }
    })

    this.eventView.setToEvent(this.eventView.eventDefinitions.INTRO)
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
    this.zones[zoneParams.id] = zoneView

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

    const zoneView = this.zones[zone]

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
    this.draggedCardView = null
    this.cardEffectView.hide()

    // we get here if we dropped card into a zone
    if (this.pointedZoneView) {
      this.pointedZoneView.unhighlight()

      if (!cardView.model.changeZone(this.pointedZoneView.id)) {
        cardView.cancelDrag()
        this.zones[cardView.model.zone].reorderStackedCardDepths()
      } else if (this.pointedZoneView.id === 'homunculus') {
        // Every time we feed a homunculus, a day passes
        this.endTurnProcessor.processTurn()
      }
    }

    if (this.pointedCardView) {
      console.log(
        `Dropped card ${cardView.model.definition.id} at ${this.pointedCardView.model.definition.id}`,
      )
    }
  }

  preload() {}

  update() {
    updateGlobalPositionLabel(this.globalPositionLabel)
    updateGlobalTrackerLabel(this.globalTrackerLabel)
  }

  create() {
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
  }
}
