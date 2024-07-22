import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import type { IdHolder } from '@potato-golem/core'
import {
  type Position,
  type PotatoScene,
  SpriteBuilder,
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
  private readonly cardShadowSprite: Phaser.GameObjects.Sprite

  /**
   * Generic frame for the card
   */
  private readonly cardFrameSprite: Phaser.GameObjects.Sprite

  /**
   * Card-specific image for the card
   */
  private readonly cardPictureSprite: Phaser.GameObjects.Sprite

  private readonly cardMainSpriteContainer: Container

  /**
   * Text element with the name of the card
   */
  private readonly title: Phaser.GameObjects.Text

  id: string

  private dragDeltaX = 0
  private dragDeltaY = 0

  /**
   * Domain model of the card
   */
  private readonly model: CardModel
  private readonly endTurnProcessor: EndTurnProcessor

  public static readonly cardWidth: number = 230
  public static readonly cardHeight: number = 277

  public static readonly cardImageWidth: number = 480
  public static readonly cardImageHeight: number = 640

  constructor(scene: PotatoScene, params: CardViewParams, dependencies: CardViewDependencies) {
    super(scene)

    this.id = params.model.id
    this.x = params.x
    this.y = params.y
    this.setDepth(100)

    this.model = params.model
    this.endTurnProcessor = dependencies.endTurnProcessor

    this.cardShadowSprite = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.CARD_FRAME)
      .setPosition({
        x: 1,
        y: 2,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(CardView.cardWidth)
      .setHeight(CardView.cardHeight)
      .build()
    this.cardShadowSprite.setTint(0x000000)
    this.cardShadowSprite.setAlpha(0.5)
    this.cardShadowSprite.setScale(1.01)
    this.add(this.cardShadowSprite)

    this.cardFrameSprite = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.CARD_FRAME)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(CardView.cardWidth)
      .setHeight(CardView.cardHeight)
      .build()

    this.cardPictureSprite = SpriteBuilder.instance(scene)
      .setTextureKey(params.model.definition.image)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(CardView.cardImageWidth)
      .setHeight(CardView.cardImageHeight)
      .build()
    this.cardPictureSprite.setScale((CardView.cardHeight - 20) / CardView.cardImageHeight)

    this.cardMainSpriteContainer = new Container(scene)
    this.cardMainSpriteContainer.add(this.cardFrameSprite)
    this.cardMainSpriteContainer.add(this.cardPictureSprite)

    this.add(this.cardMainSpriteContainer)

    setEntityType(this.cardFrameSprite, EntityTypeRegistry.CARD)
    setEntityModel(this.cardFrameSprite, this.model)

    scene.add.existing(this)

    this.cardFrameSprite
      .setInteractive({
        draggable: true,
        pixelPerfect: false,
        alphaTolerance: undefined,
        useHandCursor: true,
      })
      .on('dragstart', (pointer, dragX, dragY) => {
        console.log('dragstart')

        this.dragDeltaX = pointer.x - this.x
        this.dragDeltaY = pointer.y - this.y

        scene.tweens.add({
          targets: this.cardMainSpriteContainer,
          scale: 1.1,
          duration: 200,
          ease: 'Cubic',
         })
        scene.tweens.add({
          targets: this.cardShadowSprite,
          x: 20,
          y: 30,
          duration: 200,
          ease: 'Cubic',
         })
      })
      .on('drag', (pointer, dragX, dragY) => {
        //Disable input events on the card so that it does not block pointer events for zones
        this.cardFrameSprite.input.enabled = false
        this.setPosition(pointer.x - this.dragDeltaX, pointer.y - this.dragDeltaY)
      })
      .on('drop', (pointer, target) => {
        console.log('drop')
        //Re-enable input events to not break drag and drop
        this.cardFrameSprite.input.enabled = true
      })
      .on('dragend', (pointer, dragX, dragY, dropped) => {
        console.log('dragend')
        scene.tweens.add({
          targets: this.cardMainSpriteContainer,
          scale: 1,
          duration: 200,
          ease: 'Cubic',
         })
         scene.tweens.add({
          targets: this.cardShadowSprite,
          x: 1,
          y: 2,
          duration: 200,
          ease: 'Cubic',
         })
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
