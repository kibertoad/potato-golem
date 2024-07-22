import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import type { IdHolder } from '@potato-golem/core'
import {
  type Position,
  type PotatoScene,
  SpriteBuilder,
  TextBuilder,
  buildDragWithActivations,
  setEntityModel,
  setEntityType,
} from '@potato-golem/ui'
import type { CardModel } from '../../../model/entities/CardModel'
import type { EndTurnProcessor } from '../../../model/processors/EndTurnProcessor'
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import { ImageRegistry } from '../../../model/registries/imageRegistry'

export type CardViewParams = {
  model: CardModel
} & Position

export type CardViewDependencies = {
  endTurnProcessor: EndTurnProcessor
}

const textOffsetX = 35
const textOffsetY = 5

export class CardView extends Container implements IdHolder {
  /**
   * Generic frame for the card
   */
  private readonly cardFrameSprite: Phaser.GameObjects.Sprite

  /**
   * Card-specific image for the card
   */
  private readonly cardPictureSprite: Phaser.GameObjects.Sprite

  /**
   * Text element with the name of the card
   */
  private readonly title: Phaser.GameObjects.Text

  id: string

  private dragDeltaX: number = 0
  private dragDeltaY: number = 0

  /**
   * Domain model of the card
   */
  private readonly model: CardModel
  private readonly endTurnProcessor: EndTurnProcessor

  constructor(scene: PotatoScene, params: CardViewParams, dependencies: CardViewDependencies) {
    super(scene)

    this.id = params.model.id
    this.x = params.x
    this.y = params.y
    this.setDepth(100)

    this.model = params.model
    this.endTurnProcessor = dependencies.endTurnProcessor

    this.cardFrameSprite = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.CARD_FRAME)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0, 0)
      .setWidth(120)
      .setHeight(180)
      .build()

    this.cardPictureSprite = SpriteBuilder.instance(scene)
      .setTextureKey(params.model.definition.image)
      .setPosition({
        x: 0,
        y: 30,
      })
      .setOrigin(0, 0)
      .setWidth(120)
      .setHeight(140)
      .build()

    this.title = TextBuilder.instance(scene)
      .setRelativePositionFromBackground(this, textOffsetX, textOffsetY)
      .setOrigin(0, 0)
      .setText(params.model.name)
      .setDisplaySize(15, 15)
      .build().value

    setEntityType(this.cardFrameSprite, EntityTypeRegistry.CARD)
    setEntityModel(this.cardFrameSprite, this.model)

    this.add(this.cardFrameSprite)
    this.add(this.cardPictureSprite)
    this.add(this.title)

    scene.add.existing(this)

    this.cardFrameSprite.setInteractive({
      draggable: true,
      pixelPerfect: false,
      alphaTolerance: undefined,
      useHandCursor: true,
    }).on('dragstart', (pointer, dragX, dragY) => {
      this.dragDeltaX = pointer.x - this.x
      this.dragDeltaY = pointer.y - this.y

      //Disable input events on the card so that it does not block pointer events for zones
      this.cardFrameSprite.input.enabled = false
      console.log('dragstart')
    })
    .on('drag', (pointer, dragX, dragY) => {
      this.setPosition(pointer.x - this.dragDeltaX, pointer.y - this.dragDeltaY)
    })
    .on('drop', (pointer, target) => {
      //Re-enable input events to not break drag and drop
      this.cardFrameSprite.input.enabled = true
      console.log('drop')
    })

    // Build ticket drag'n'drop
    // buildDragWithActivations({
    //   dragStartItem: this.cardFrameSprite,
    //   draggedItem: this,
    //   dropActivations: {
    //     [EntityTypeRegistry.DEFAULT]: () => {
    //       // restoreStartPosition(this)
    //       this.endTurnProcessor.processTurn()
    //     },
    //   },
    //   config: {},
    //   potentialHoverTargets: [],
    //   potentialDropTargets: [],
    // })
  }
}
