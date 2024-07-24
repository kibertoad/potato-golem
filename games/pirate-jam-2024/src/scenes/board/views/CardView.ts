import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import type { EventSink, IdHolder } from '@potato-golem/core'
import {
  type Position,
  type PotatoScene,
  SpriteBuilder,
  TextBuilder,
  setEntityModel,
  setEntityType,
} from '@potato-golem/ui'
import type { CardModel } from '../../../model/entities/CardModel'
import type { EndTurnProcessor } from '../../../model/processors/EndTurnProcessor'
import { DepthRegistry } from '../../../model/registries/depthRegistry'
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import { ImageRegistry } from '../../../model/registries/imageRegistry'
import { SfxRegistry } from '../../../model/registries/sfxRegistry'
import { delay } from '../../../utils/timeUtils'
import type { BoardSupportedEvents } from '../BoardScene'

export type CardViewParams = {
  model: CardModel
  onDragStart?: (card: CardView) => void
  onDragEnd?: (card: CardView) => void
} & Position

export type CardViewDependencies = {
  endTurnProcessor: EndTurnProcessor
  boardEventSink: EventSink<BoardSupportedEvents>
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

  private cardEatMaskImage: Phaser.GameObjects.Image
  private cardEat2MaskImage: Phaser.GameObjects.Image

  private cardEatShadowMaskImage: Phaser.GameObjects.Image
  private cardEat2ShadowMaskImage: Phaser.GameObjects.Image

  /**
   * Text element with the name of the card
   */
  private readonly title: Phaser.GameObjects.Text

  id: string

  private dragDeltaX = 0
  private dragDeltaY = 0

  private dragDistanceFromCenter: Position = { x: 0, y: 0 }

  /**
   * Domain model of the card
   */
  readonly model: CardModel
  private readonly endTurnProcessor: EndTurnProcessor

  public static readonly cardWidth: number = 230
  public static readonly cardHeight: number = 277

  public static readonly cardImageWidth: number = 480
  public static readonly cardImageHeight: number = 640
  private readonly boardEventSink: EventSink<BoardSupportedEvents>

  constructor(scene: PotatoScene, params: CardViewParams, dependencies: CardViewDependencies) {
    super(scene)

    this.id = params.model.id
    this.x = params.x
    this.y = params.y

    this.model = params.model
    this.model.view = this
    this.endTurnProcessor = dependencies.endTurnProcessor
    this.boardEventSink = dependencies.boardEventSink

    this.title = TextBuilder.instance(scene)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0, 0)
      .setText(params.model.name)
      .setDisplaySize(15, 15)
      .build()
      .value.setDepth(DepthRegistry.CARD_MIN)

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
    this.cardMainSpriteContainer.add(this.title)

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
      .on('dragstart', (pointer, _dragX, _dragY) => {
        this.dragDeltaX = pointer.x - this.x
        this.dragDeltaY = pointer.y - this.y

        this.dragDistanceFromCenter.x = (this.x - 1280) / 1280
        this.dragDistanceFromCenter.y = (this.y - 720) / 720

        scene.tweens.add({
          targets: this.cardMainSpriteContainer,
          scale: 1.1,
          duration: 200,
          ease: 'Cubic',
        })
        scene.tweens.add({
          targets: this.cardShadowSprite,
          x: 30 * this.dragDistanceFromCenter.x,
          y: 50 * this.dragDistanceFromCenter.y,
          scaleX: 1.05 + Math.abs(this.dragDistanceFromCenter.x / 3),
          scaleY: 1.05 + Math.abs(this.dragDistanceFromCenter.y / 3),
          alpha:
            0.6 *
            (1 -
              Math.max(
                Math.abs(this.dragDistanceFromCenter.x),
                Math.abs(this.dragDistanceFromCenter.y),
              )),
          duration: 200,
          ease: 'Cubic',
        })
        if (params.onDragStart) {
          params.onDragStart(this)
        }
      })
      .on('drag', (pointer, dragX, dragY) => {
        //Disable input events on the card so that it does not block pointer events for zones
        this.cardFrameSprite.input.enabled = false
        this.setPosition(pointer.x - this.dragDeltaX, pointer.y - this.dragDeltaY)

        this.dragDistanceFromCenter.x = (this.x - 1280) / 1280
        this.dragDistanceFromCenter.y = (this.y - 720) / 720
        this.cardShadowSprite.setPosition(
          30 * this.dragDistanceFromCenter.x,
          50 * this.dragDistanceFromCenter.y,
        )
        this.cardShadowSprite.alpha =
          0.6 *
          (1 -
            Math.max(
              Math.abs(this.dragDistanceFromCenter.x),
              Math.abs(this.dragDistanceFromCenter.y),
            ))
        this.cardShadowSprite.setScale(
          1.05 + Math.abs(this.dragDistanceFromCenter.x / 3),
          1.05 + Math.abs(this.dragDistanceFromCenter.y / 3),
        )
      })
      .on('drop', (pointer, target) => {
        //Re-enable input events to not break drag and drop
        this.cardFrameSprite.input.enabled = true
      })
      .on('dragend', (pointer, dragX, dragY, dropped) => {
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
          scale: 1.01,
          alpha: 0.5,
          duration: 200,
          ease: 'Cubic',
        })
        if (params.onDragEnd) {
          params.onDragEnd(this)
        }
      })
      .on('pointerover', () => {
        console.log(this.model.id, 'card was hovered over')
        this.boardEventSink.emit('CARD_HOVERED', this)
      })
  }

  createEatMasks() {
    this.cardEatMaskImage = this.scene.make.image({
      x: this.x,
      y: this.y,
      key: ImageRegistry.CARD_FRAME_EAT,
      add: false,
    })

    this.cardEat2MaskImage = this.scene.make.image({
      x: this.x,
      y: this.y,
      key: ImageRegistry.CARD_FRAME_EAT_2,
      add: false,
    })

    this.cardEatShadowMaskImage = this.scene.make.image({
      x: this.x + this.cardShadowSprite.x,
      y: this.y + this.cardShadowSprite.y,
      key: ImageRegistry.CARD_FRAME_EAT,
      add: false,
    })
    this.cardEatShadowMaskImage.scaleX = this.cardShadowSprite.scaleX
    this.cardEatShadowMaskImage.scaleY = this.cardShadowSprite.scaleY

    this.cardEat2ShadowMaskImage = this.scene.make.image({
      x: this.x + this.cardShadowSprite.x,
      y: this.y + this.cardShadowSprite.y,
      key: ImageRegistry.CARD_FRAME_EAT_2,
      add: false,
    })
    this.cardEat2ShadowMaskImage.scaleX = this.cardShadowSprite.scaleX
    this.cardEat2ShadowMaskImage.scaleY = this.cardShadowSprite.scaleY
  }

  async playEatAnimation(onEatenCallback?: () => void) {
    this.cardFrameSprite.setInteractive(false).removeAllListeners()
    await delay(200)
    this.createEatMasks()
    let mask = new Phaser.Display.Masks.BitmapMask(this.scene, this.cardEatMaskImage)
    let shadowMask = new Phaser.Display.Masks.BitmapMask(this.scene, this.cardEatShadowMaskImage)

    this.scene.sound.play(SfxRegistry.BITE_1)
    this.cardMainSpriteContainer.setMask(mask)
    this.cardShadowSprite.setMask(shadowMask)

    await delay(300)

    mask = new Phaser.Display.Masks.BitmapMask(this.scene, this.cardEat2MaskImage)
    shadowMask = new Phaser.Display.Masks.BitmapMask(this.scene, this.cardEat2ShadowMaskImage)

    this.scene.sound.play(SfxRegistry.BITE_3)
    this.cardMainSpriteContainer.setMask(mask)
    this.cardShadowSprite.setMask(shadowMask)

    await delay(300)
    this.scene.sound.play(SfxRegistry.BITE_2)
  }
}
