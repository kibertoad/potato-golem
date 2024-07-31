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
import { CardView, type SpawnAnimation } from './views/CardView'
import Sprite = Phaser.GameObjects.Sprite
import {
  type CommonEntity,
  type EventSink,
  type EventSource,
  type QueuedActivation,
  randomOneOf,
} from '@potato-golem/core'
import type { EVENT_EVENTS } from '../../model/activations/event/eventActivations'
import {
  type CardDefinition,
  type CardDefinitions,
  cardDefinitions,
} from '../../model/definitions/cardDefinitions'
import type { EventId } from '../../model/definitions/eventDefinitions'
import type { EndTurnProcessor } from '../../model/processors/EndTurnProcessor'
import { EntityTypeRegistry } from '../../model/registries/entityTypeRegistry'
import { ImageRegistry } from '../../model/registries/imageRegistry'
import type { Zone } from '../../model/registries/zoneRegistry'
import type { MusicScene } from '../MusicScene'
import { EventView } from './views/EventView'

export type BoardSupportedEvents =
  | typeof EVENT_EVENTS.SPAWN_CARD
  | 'CARD_HOVERED'
  | 'CARD_DRAGGED_OVER_CARD'
  | 'ZONE_HOVERED_OVER'
  | 'START_EVENT'
  | 'QUEUE_ACTIVATION'
  | 'NEXT_TURN'
  | 'HOMUNCULUS_EVOLVED'
  | 'SPAWN_MUSE'
  | 'SPAWN_ID'

import { TextBuilder } from '@potato-golem/ui'
import {
  AlcoholismActivation,
  EvolutionActivation,
  HungerActivation,
  SingingMushroomActivation,
  TheRaidActivation,
} from '../../model/activations/card/recurringActivations'
import type { SpawnCardMessage } from '../../model/activations/event/extraEventActivations'
import { zones } from '../../model/definitions/zoneDefinitions'
import { EventDirector } from '../../model/processors/EventDirector'
import type { CardId } from '../../model/registries/cardRegistry'
import { DepthRegistry } from '../../model/registries/depthRegistry'
import { EventEmitters } from '../../model/registries/eventEmitterRegistry'
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
  private inputBlockRectangle: Phaser.GameObjects.Rectangle

  private readonly endTurnProcessor: EndTurnProcessor
  private eventDirector!: EventDirector

  private cardDefinitions: CardDefinitions

  private draggedCardView?: CardView = null
  private cards: CardView[] = []
  private homunculus: HomunculusView
  private eventView: EventView
  private cardEffectView: CardEffectView

  private pointedZoneView?: ZoneView
  private pointedCardView?: CardView

  private inputBlockCounter = 0

  private readonly eventSink: EventSink<BoardSupportedEvents> & EventSource<BoardSupportedEvents>

  constructor({ musicScene, worldModel, endTurnProcessor }: Dependencies) {
    super(Scenes.BOARD_SCENE)

    this.musicScene = musicScene
    this.worldModel = worldModel

    this.eventSink = EventEmitters.boardEventEmitter
    this.cardDefinitions = cardDefinitions

    this.endTurnProcessor = endTurnProcessor

    this.registerListeners()
  }

  private registerListeners() {
    this.eventSink.on('NEXT_TURN', (playedCard?: CardModel) => {
      console.log('yes, next turn')
      this.nextTurn(playedCard)
    })

    this.eventSink.on('spawn_card', (event: SpawnCardMessage) => {
      for (let x = 0; x < event.amount; x++) {
        this.addCard(event.cardId, event.zone, event.spawnAnimation, event.sourceCard)
      }
    })

    this.eventSink.on('CARD_HOVERED', (card: CardView) => {
      if (this.pointedCardView) {
        this.pointedCardView.unhighlight()
      }

      this.eventSink.on('HOMUNCULUS_EVOLVED', () => {
        this.gameOver(`Homunculus has evolved. \nIt's going to be OK now.`, 72)
      })

      this.eventSink.on('SPAWN_MUSE', () => {
        if (this.worldModel.hasCard('SHADOW_MUSE')) {
          return
        }

        const zone = randomOneOf(['home', 'alchemy', 'lab'] satisfies Zone[])
        this.addCard('SHADOW_MUSE', zone, 'pop_in')
      })

      this.eventSink.on('SPAWN_ID', () => {
        if (this.worldModel.hasCard('THE_ID')) {
          return
        }

        this.addCard('THE_ID', 'home', 'pop_in')
      })

      this.pointedCardView = card

      // Green highlight logic for the dragged card
      if (this.draggedCardView) {
        this.cardEffectView.showCardCombinationEffect(this.draggedCardView, this.pointedCardView)

        const combinationResult = this.draggedCardView.model.getActivationForCombinedCard(
          this.pointedCardView.model,
        )

        if (combinationResult.effect !== undefined) {
          this.draggedCardView.highlight()
          this.pointedCardView.highlight()
        }
        if (typeof combinationResult.failReason === 'string') {
          this.draggedCardView.highlight(true)
          this.pointedCardView.highlight(true)
        }
      }

      if (this.pointedZoneView) {
        this.pointedZoneView.unhighlight()
        this.pointedZoneView = null
      }
    })

    this.eventSink.on('START_EVENT', (eventId: EventId, targetCard?: CardModel) => {
      this.eventView.setToEvent(eventId, targetCard)
      this.eventView.show()
    })

    this.eventSink.on(
      'QUEUE_ACTIVATION',
      (activation: QueuedActivation, targetCard?: CardModel) => {
        this.eventDirector.addQueuedActivation(activation, targetCard)
      },
    )

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
      boardEventSink: this.eventSink,
    })
    this.eventDirector = new EventDirector(this.eventView.eventDefinitions, this.eventSink)

    this.worldModel.homunculusModel.reset()
    this.homunculus = new HomunculusView(this, { model: this.worldModel.homunculusModel })
    this.cardEffectView = new CardEffectView(this, {
      cardDefinitions: this.cardDefinitions,
    })

    this.initZones()

    this.addCard('MOLD', 'alchemy', 'none')

    this.addCard('WORKBENCH', 'lab', 'none')

    this.addCard('ABSINTHE', 'home', 'none')

    this.addCard('HEALTH', 'home', 'none')
    this.addCard('HEALTH', 'home', 'none')
    this.addCard('HEALTH', 'home', 'none')

    this.addCard('EXPLOSIVES', 'lab', 'none')

    this.addCard('MONEY', 'home', 'none')
    this.addCard('MERCHANT', 'streets', 'none')

    this.eventBus.on('DESTROY', (entity: CommonEntity) => {
      if (entity.type === EntityTypeRegistry.CARD) {
        this.worldModel.removeCard(entity.id)
        this.removeCardByUuid(entity.id)
        this.destroyChildByModelId(entity.id)

        const healthCards = this.cards.filter(
          (cardView) => cardView.model.definition.id === 'HEALTH',
        )
        if (healthCards.length === 0) {
          this.gameOver('You are dead')
        }
      }
    })
    this.eventBus.on('MOVE', (entity: CommonEntity, previousZone: Zone) => {
      if (entity.type === EntityTypeRegistry.CARD) {
        this.worldModel.removeCardFromZone(previousZone, entity.id)
      }
    })

    this.eventView.setToEvent('INTRO')
    this.eventView.show()

    // recurring effects

    this.eventDirector.addRecurringActivation(new SingingMushroomActivation())
    this.eventDirector.addRecurringActivation(new TheRaidActivation())
    this.eventDirector.addRecurringActivation(new HungerActivation())
    this.eventDirector.addRecurringActivation(new EvolutionActivation())
    this.eventDirector.addRecurringActivation(new AlcoholismActivation())
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

    console.log(`added zone ${zoneParams.id}`)

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

  async addCard(
    cardId: CardId,
    zone: Zone,
    spawnAnimation?: SpawnAnimation,
    sourceCard?: CardModel,
  ) {
    const cardDefinition: CardDefinition = this.cardDefinitions[cardId]
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
        chatBubbleOrigin: cardDefinition.chatBubbleOrigin,
        chatBubbleRightOffset: cardDefinition.chatBubbleRightOffset,
        onDragStart: (cardView: CardView) => this.onCardDragStart(cardView),
        onDrag: (cardView: CardView) => this.onCardDrag(cardView),
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

    if (sourceCard) {
      cardView.animateMoveFrom({
        x: sourceCard.view.x,
        y: sourceCard.view.y,
      })
    }
    await cardView.playAnimation(spawnAnimation)
    if (cardDefinition.spawnPhrases && spawnAnimation !== 'none') {
      cardView.say(cardDefinition.spawnPhrases)
    }
  }

  removeCardByUuid(cardUuid: string) {
    this.cards = this.cards.filter((cardView) => cardView.model.id !== cardUuid)
  }

  onCardDragStart(cardView: CardView) {
    this.draggedCardView = cardView
    this.cardEffectView.moveWithCard(cardView)
    this.cardEffectView.setText('')
    if (this.pointedZoneView) {
      this.pointedZoneView.highlight()
    }
    this.moveCardToTop(cardView)
  }

  onCardDrag(cardView: CardView) {
    this.cardEffectView.moveWithCard(cardView)
  }

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
  onCardDragEnd(cardView: CardView) {
    this.blockInput()
    this.draggedCardView.unhighlight()
    this.draggedCardView = null
    this.cardEffectView.hide()

    let wasCardActivated = false

    // we get here if we dropped card into a zone
    if (this.pointedZoneView) {
      this.pointedZoneView.unhighlight()

      wasCardActivated = cardView.model.changeZone(this.pointedZoneView.id)

      if (cardView.model.hasActivationForZone(this.pointedZoneView.id)) {
        const activation = cardView.model.definition.idleZoneEffect[this.pointedZoneView.id]
        if (activation.timeTillTrigger === 0) {
          void activation.effect.activate(cardView.model)

          //TODO: This is a HACK to compensate for homunculus eating animation
          //Otherwise we have to deal with an unknown async system issue
          if (this.pointedZoneView.id === 'homunculus') {
            this.blockInput()
            setTimeout(() => {
              this.unblockInput()
            }, 900)
          }
        }
      }

      // ToDo replace with more generic logic
      if (wasCardActivated) {
        //Move card to the start of this.worldModel.cards
        const index = this.worldModel.cards.indexOf(cardView.model)
        this.worldModel.cards.splice(index, 1)
        this.worldModel.cards.unshift(cardView.model)

        // Every time we feed a homunculus, a day passes
        // this.nextTurn(cardView.model)
        //this.resetCard(cardView.model)
      }
    }

    if (this.pointedCardView) {
      this.pointedCardView.unhighlight()
      console.log(
        `Dropped card ${cardView.model.definition.id} at ${this.pointedCardView.model.definition.id}`,
      )

      wasCardActivated = wasCardActivated || this.tryCombineCards(cardView, this.pointedCardView)
    }

    if (!wasCardActivated) {
      cardView.cancelDrag()
      this.worldModel.zones[cardView.model.zone].reorderStackedCardDepths()
    }

    this.unblockInput()

    return wasCardActivated
  }

  private tryCombineCards(cardView: CardView, pointedCardView: CardView): boolean {
    let combinationOwnerCard = cardView
    let combinationChildCard = pointedCardView

    //Check if the dragged card has any combination activations in strict mode
    let combinationEffect = combinationOwnerCard.model.getActivationForCombinedCard(
      combinationChildCard.model,
      false,
      true,
    ).effect
    if (!combinationEffect) {
      //If no combinations found, check the other way around (if the pointed card has any activations)
      combinationEffect = combinationChildCard.model.getActivationForCombinedCard(
        combinationOwnerCard.model,
        false,
        true,
      ).effect

      //Swap the cards, so that the activation happens from the perspective
      //of the card that has the activation defined
      if (combinationEffect) {
        combinationOwnerCard = pointedCardView
        combinationChildCard = cardView
      }
    }
    if (combinationEffect) {
      combinationOwnerCard.model.combineWithCard(combinationChildCard.model)

      if (combinationEffect.timeTillTrigger === 0) {
        combinationEffect.effect.activate(combinationOwnerCard.model)
      }
      return true
    }

    return false
  }

  async nextTurn(playedCard?: CardModel) {
    /*
    if (playedCard) {
      //Move card to the start of this.worldModel.cards
      const index = this.worldModel.cards.indexOf(playedCard)
      this.worldModel.cards.splice(index, 1)
      this.worldModel.cards.unshift(playedCard)
    }
     */
    this.blockInput()
    await this.endTurnProcessor.processTurn()
    await this.eventDirector.processTurn()
    this.unblockInput()
  }

  blockInput() {
    this.inputBlockCounter++
    console.log('Block input', this.inputBlockCounter)
    this.inputBlockRectangle.setVisible(true)
  }

  unblockInput() {
    this.inputBlockCounter--
    console.log('Block input', this.inputBlockCounter)
    if (this.inputBlockCounter <= 0) {
      this.inputBlockCounter = 0
      this.inputBlockRectangle.setVisible(false)
    }
  }

  private gameOverPlayed = false
  async gameOver(text: string, fontSize = 120) {
    if (this.gameOverPlayed) {
      return
    }
    this.gameOverPlayed = true
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

    title.setFontSize(fontSize)
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
    window.location.reload()
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
    this.anims.create({
      key: 'blood_splat',
      frames: [
        { key: ImageRegistry.BLOOD_1 },
        { key: ImageRegistry.BLOOD_2 },
        { key: ImageRegistry.BLOOD_3, duration: 5000 },
      ],
      frameRate: 8,
    })
    this.anims.create({
      key: 'explosion',
      frames: [
        { key: ImageRegistry.EXPLOSION_1 },
        { key: ImageRegistry.EXPLOSION_2 },
        { key: ImageRegistry.EXPLOSION_3 },
        { key: ImageRegistry.EXPLOSION_4 },
      ],
      frameRate: 8,
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

    this.inputBlockRectangle = new Phaser.GameObjects.Rectangle(
      this,
      1280,
      720,
      2560,
      1440,
      0,
      0.001,
    )
    this.inputBlockRectangle.setInteractive({
      draggable: false,
      pixelPerfect: false,
      alphaTolerance: undefined,
      useHandCursor: false,
    })
    this.inputBlockRectangle.setVisible(false)
    this.inputBlockRectangle.setDepth(DepthRegistry.INPUT_BLOCK)
    this.add.existing(this.inputBlockRectangle)

    this.globalPositionLabel = createGlobalPositionLabel(this)
    this.globalTrackerLabel = createGlobalTrackerLabel(this)

    this.worldModel.homunculusModel.eventSink.on('DEATH', () => {
      this.gameOver('Homunculus\nis dead')
    })
    this.musicScene.playBoardTheme()
  }
}
