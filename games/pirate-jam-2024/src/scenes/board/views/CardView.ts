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
import { audioSystem } from '../../..'
import type { CardModel } from '../../../model/entities/CardModel'
import type { EndTurnProcessor } from '../../../model/processors/EndTurnProcessor'
import { DepthRegistry } from '../../../model/registries/depthRegistry'
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import { ImageRegistry } from '../../../model/registries/imageRegistry'
import { SfxEventRegistry } from '../../../model/registries/sfxEventRegistry'
import { delay } from '../../../utils/timeUtils'
import type { BoardSupportedEvents } from '../BoardScene'

export type CardViewParams = {
  model: CardModel
  chatBubbleOrigin?: Position
  chatBubbleRightOffset?: number
  onDragStart?: (card: CardView) => void
  onDrag?: (card: CardView) => void
  onDragEnd?: (card: CardView) => boolean | undefined | Promise<boolean>
} & Position

export type CardViewDependencies = {
  endTurnProcessor: EndTurnProcessor
  boardEventSink: EventSink<BoardSupportedEvents>
}

export type SpawnAnimation = 'none' | 'fly_in_left' | 'pop_in'

export type ChatVerticalDirection = 'up' | 'down'
export type ChatHorizontalDirection = 'left' | 'right'

export type DirectionResult = {
  vertical: ChatVerticalDirection
  horizontal: ChatHorizontalDirection
}

const textOffsetX = 35
const textOffsetY = 5

export class CardView extends Container implements IdHolder {
  private readonly cardShadowSprite: Phaser.GameObjects.Sprite

  /**
   * Generic frame for the card
   */
  private readonly cardFrameSprite: Phaser.GameObjects.Sprite
  private readonly cardFrameGlow: Phaser.GameObjects.Sprite
  private readonly cardFrameRedGlow: Phaser.GameObjects.Sprite
  private readonly cardFrameDecorSprite: Phaser.GameObjects.Sprite
  private readonly cardFrameNailsSprite: Phaser.GameObjects.Sprite

  private readonly cardExplosionSprite: Phaser.GameObjects.Sprite

  /**
   * Card-specific image for the card
   */
  private readonly cardPictureSprite: Phaser.GameObjects.Sprite

  private readonly cardMainSpriteContainer: Container

  private cardEatMaskImage: Phaser.GameObjects.Image
  private cardEat2MaskImage: Phaser.GameObjects.Image

  private cardEatShadowMaskImage: Phaser.GameObjects.Image
  private cardEat2ShadowMaskImage: Phaser.GameObjects.Image

  private readonly chatBubbleContainer: Container
  private chatBubbleSlice: Phaser.GameObjects.NineSlice
  private chatTextView: Phaser.GameObjects.Text

  private readonly potatoScene: PotatoScene

  private readonly chatBubbleOrigin: Position = { x: 0, y: 0 }
  private readonly chatBubbleRightOffset: number = 0
  private tmpChatDepth = 0

  private chatScaleTween: Phaser.Tweens.Tween
  private chatAlphaTween: Phaser.Tweens.Tween
  private chatFadeOutTween: Phaser.Tweens.Tween

  /**
   * Text element with the name of the card
   */
  private readonly title: Phaser.GameObjects.Text

  id: string

  private dragDeltaX = 0
  private dragDeltaY = 0

  private dragDistanceFromCenter: Position = { x: 0, y: 0 }
  private positionBeforeDrag: Position = { x: 0, y: 0 }

  /**
   * Domain model of the card
   */
  readonly model: CardModel
  private readonly endTurnProcessor: EndTurnProcessor

  private isDragging = false
  private isActive = false

  public static readonly cardWidth: number = 230
  public static readonly cardHeight: number = 277

  public static readonly cardImageWidth: number = 480
  public static readonly cardImageHeight: number = 640
  private readonly boardEventSink: EventSink<BoardSupportedEvents>

  constructor(scene: PotatoScene, params: CardViewParams, dependencies: CardViewDependencies) {
    super(scene)

    this.potatoScene = scene
    if (params.chatBubbleOrigin) {
      this.chatBubbleOrigin = params.chatBubbleOrigin
    }
    if (params.chatBubbleRightOffset) {
      this.chatBubbleRightOffset = params.chatBubbleRightOffset
    }
    this.id = params.model.id
    this.x = params.x
    this.y = params.y

    this.model = params.model
    this.model.view = this
    this.endTurnProcessor = dependencies.endTurnProcessor
    this.boardEventSink = dependencies.boardEventSink

    this.cardMainSpriteContainer = new Container(scene)

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

    this.cardFrameGlow = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.CARD_GLOW)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(CardView.cardWidth + 20)
      .setHeight(CardView.cardHeight + 20)
      .build()
    this.cardFrameGlow.setAlpha(0)
    this.cardMainSpriteContainer.add(this.cardFrameGlow)

    this.cardFrameRedGlow = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.CARD_GLOW_RED)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(CardView.cardWidth + 20)
      .setHeight(CardView.cardHeight + 20)
      .build()
    this.cardFrameRedGlow.setAlpha(0)
    this.cardMainSpriteContainer.add(this.cardFrameRedGlow)

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

    this.cardMainSpriteContainer.add(this.cardFrameSprite)

    if (params.model.definition.image) {
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
      this.cardMainSpriteContainer.add(this.cardPictureSprite)
    } else {
      this.title = TextBuilder.instance(scene)
        .setPosition({
          x: 0,
          y: 0,
        })
        .setOrigin(0.5, 0.5)
        .setText(params.model.name)
        .setDisplaySize(15, 15)
        .build()
        .value.setDepth(DepthRegistry.CARD_MIN)
      this.title.setFontSize(40)
      this.title.setColor('#000000')
      this.title.setAlign('center')
      this.title.setText(this.title.getWrappedText().map((line) => line.trim()))
      this.cardMainSpriteContainer.add(this.title)
    }

    this.cardFrameDecorSprite = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.CARD_FRAME_DECOR)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(CardView.cardWidth)
      .setHeight(CardView.cardHeight)
      .build()
    this.cardFrameDecorSprite.setVisible(!this.model.definition.nonDraggable)
    this.cardMainSpriteContainer.add(this.cardFrameDecorSprite)

    if (this.model.definition.nonDraggable) {
      this.cardFrameNailsSprite = SpriteBuilder.instance(scene)
        .setTextureKey(ImageRegistry.CARD_FRAME_NAILS)
        .setPosition({
          x: 0,
          y: 0,
        })
        .setOrigin(0.5, 0.5)
        .setWidth(CardView.cardWidth)
        .setHeight(CardView.cardHeight)
        .build()
      this.cardMainSpriteContainer.add(this.cardFrameNailsSprite)
    }

    this.chatBubbleContainer = new Container(scene)
    this.chatBubbleSlice = new Phaser.GameObjects.NineSlice(
      this.scene,
      0,
      0,
      ImageRegistry.CHAT_BUBBLE,
      undefined,
      300,
      200,
      30,
      89,
      34,
      72,
    )

    this.chatTextView = TextBuilder.instance(this.potatoScene)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0.5, 0.5)
      .setDisplaySize(500, 15)
      .build().value
    this.chatTextView.setFontSize(25)
    this.chatTextView.setColor('#000000')
    this.chatTextView.setAlign('center')

    this.chatBubbleContainer.setVisible(false)
    this.chatBubbleContainer.add(this.chatBubbleSlice)
    this.chatBubbleContainer.add(this.chatTextView)
    this.cardMainSpriteContainer.add(this.chatBubbleContainer)

    this.add(this.cardMainSpriteContainer)

    this.cardExplosionSprite = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.EXPLOSION_1)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(CardView.cardWidth)
      .setHeight(CardView.cardHeight)
      .build()
    this.cardExplosionSprite.setVisible(false)
    this.add(this.cardExplosionSprite)

    setEntityType(this.cardFrameSprite, EntityTypeRegistry.CARD)
    setEntityModel(this.cardFrameSprite, this.model)

    scene.add.existing(this)

    this.cardFrameSprite
      .setInteractive({
        draggable: !this.model.definition.nonDraggable,
        pixelPerfect: false,
        alphaTolerance: undefined,
        useHandCursor: !this.model.definition.nonDraggable,
      })
      .on('dragstart', (pointer, _dragX, _dragY) => {
        this.isDragging = true
        this.positionBeforeDrag.x = this.x
        this.positionBeforeDrag.y = this.y

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
        audioSystem.playSfx(SfxEventRegistry.CARD)
      })
      .on('drag', (pointer, dragX, dragY) => {
        this.isDragging = true
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
        if (params.onDrag) {
          params.onDrag(this)
        }
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
        if (params.onDragEnd && params.onDragEnd(this) !== true) {
          //We want to play the sound only if card was not activated
          audioSystem.playSfx(SfxEventRegistry.CARD)
        }
        this.isDragging = false
      })
      .on('pointerover', () => {
        // console.log(this.model.id, 'card was hovered over')
        this.boardEventSink.emit('CARD_HOVERED', this)
      })
  }

  cancelDrag() {
    if (!this.isDragging) {
      return
    }
    this.scene.tweens.add({
      targets: this,
      x: this.positionBeforeDrag.x,
      y: this.positionBeforeDrag.y,
      duration: 200,
      ease: 'Cubic',
    })
  }

  highlight(red = false) {
    this.unhighlight()
    if (red) {
      this.cardFrameRedGlow.setAlpha(1)
      return
    }

    this.cardFrameGlow.setAlpha(1)
  }
  unhighlight() {
    this.cardFrameGlow.setAlpha(0)
    this.cardFrameRedGlow.setAlpha(0)
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

  setActiveCard(active: boolean, skipSound = false) {
    if (this.isActive === active) {
      return
    }
    if (!skipSound && active && this.model.definition.prettyEffects.activateSfx) {
      audioSystem.playSfx(this.model.definition.prettyEffects.activateSfx)
    }
    if (!skipSound && !active && this.model.definition.prettyEffects.deactivateSfx) {
      audioSystem.playSfx(this.model.definition.prettyEffects.deactivateSfx)
    }

    if (this.model.definition.activeImage) {
      this.cardPictureSprite.setTexture(
        active ? this.model.definition.activeImage : this.model.definition.image,
      )
    }

    this.isActive = active
  }

  isActiveCard(): boolean {
    return this.isActive
  }

  async playExplosionAnimation() {
    this.depth = DepthRegistry.CARD_MAX + 1
    this.cardShadowSprite.setVisible(false)
    this.cardMainSpriteContainer.setVisible(false)
    this.cardExplosionSprite.y = 0
    this.cardExplosionSprite.setVisible(true)
    this.cardExplosionSprite.setAlpha(1)
    await this.cardExplosionSprite.play('explosion')

    audioSystem.playSfx(SfxEventRegistry.EXPLOSION)

    this.cardExplosionSprite.once('animationcomplete', () => {
      this.scene.tweens.add({
        targets: this.cardExplosionSprite,
        alpha: 0,
        delay: 0,
        duration: 1200,
        ease: 'Cubic',
      })
    })

    await delay(1200)
  }

  async playEatAnimation(onEatenCallback?: () => void) {
    this.cardFrameSprite.setInteractive(false).removeAllListeners()
    await delay(200)
    this.createEatMasks()
    let mask = new Phaser.Display.Masks.BitmapMask(this.scene, this.cardEatMaskImage)
    let shadowMask = new Phaser.Display.Masks.BitmapMask(this.scene, this.cardEatShadowMaskImage)

    audioSystem.playSfx(SfxEventRegistry.BITE)
    this.cardMainSpriteContainer.setMask(mask)
    this.cardShadowSprite.setMask(shadowMask)

    await delay(300)

    mask = new Phaser.Display.Masks.BitmapMask(this.scene, this.cardEat2MaskImage)
    shadowMask = new Phaser.Display.Masks.BitmapMask(this.scene, this.cardEat2ShadowMaskImage)

    audioSystem.playSfx(SfxEventRegistry.BITE)
    this.cardMainSpriteContainer.setMask(mask)
    this.cardShadowSprite.setMask(shadowMask)

    await delay(300)
    audioSystem.playSfx(SfxEventRegistry.BITE)
  }

  async animateMoveFrom(moveFromPosition: Position) {
    const currentX = this.x
    const currentY = this.y
    this.x = moveFromPosition.x
    this.y = moveFromPosition.y
    this.scene.tweens.add({
      targets: this,
      x: currentX,
      y: currentY,
      duration: 300,
      ease: 'Cubic',
    })
    await delay(300)
  }

  async animateMoveTo(moveToPosition: Position) {
    this.hideChat()
    this.scene.tweens.add({
      targets: this,
      y: moveToPosition.y,
      duration: 800,
      ease: 'Cubic',
    })
    this.scene.tweens.add({
      targets: this,
      x: moveToPosition.x,
      duration: 1000,
      ease: 'Cubic',
    })
    await delay(1000)
  }

  async animateAttackTo(moveToPosition: Position) {
    this.depth = DepthRegistry.CARD_MAX + 1
    this.hideChat()

    this.scene.tweens.add({
      targets: this,
      y: moveToPosition.y,
      x: moveToPosition.x,
      duration: 400,
      ease: 'Back.easeIn',
    })
    await delay(400)
  }

  async animateRushTo(moveToPosition: Position) {
    this.depth = DepthRegistry.CARD_MAX + 1
    this.hideChat()

    this.scene.tweens.add({
      targets: this,
      y: moveToPosition.y,
      x: moveToPosition.x,
      duration: 400,
      ease: 'Back.easeOut',
    })
    await delay(400)
  }

  private async hideChat(): Promise<void> {
    let stopped = false
    if (this.chatScaleTween && this.chatScaleTween.isPlaying()) {
      this.chatScaleTween.stop()
      stopped = true
    }
    if (this.chatAlphaTween && this.chatAlphaTween.isPlaying()) {
      this.chatAlphaTween.stop()
      stopped = true
    }
    if (this.chatFadeOutTween && this.chatFadeOutTween.isPlaying()) {
      this.chatFadeOutTween.stop()
      stopped = true
    }

    if (stopped) {
      this.scene.tweens.add({
        targets: this.chatBubbleContainer,
        alpha: 0,
        delay: 0,
        duration: 100,
        ease: 'Cubic',
      })
      await delay(100)
      this.chatBubbleContainer.setVisible(false)
      if (this.depth === DepthRegistry.CARD_MAX) {
        //Restore depth only if it was not changed during the chat
        this.depth = this.tmpChatDepth
      }
    }
  }

  async say(text: string | string[]): Promise<void> {
    await this.hideChat()
    const textToSay = Array.isArray(text) ? text[Math.floor(Math.random() * text.length)] : text
    this.tmpChatDepth = this.depth

    //Temporarily set depth to max so that chat bubble is always on top
    this.depth = DepthRegistry.CARD_MAX

    this.chatTextView.setText(textToSay)
    await this.calculateChatPosition()

    await delay(0) //Allow for calculated position to take effect
    this.chatBubbleContainer.setAlpha(0).setScale(0.4).setVisible(true)
    this.chatScaleTween = this.scene.tweens.add({
      targets: this.chatBubbleContainer,
      scale: 1,
      duration: 400,
      ease: 'Back.easeOut',
    })
    this.chatAlphaTween = this.scene.tweens.add({
      targets: this.chatBubbleContainer,
      alpha: 1,
      duration: 400,
      ease: 'Cubic',
    })
    this.chatFadeOutTween = this.scene.tweens.add({
      targets: this.chatBubbleContainer,
      alpha: 0,
      delay: 3000,
      duration: 1000,
      ease: 'Cubic',
      onComplete: () => {
        this.chatBubbleContainer.setVisible(false)
        if (this.depth === DepthRegistry.CARD_MAX) {
          //Restore depth only if it was not changed during the chat
          this.depth = this.tmpChatDepth
        }
      },
    })
    await delay(1500)
  }

  public getChatBubbleDirection(): DirectionResult {
    return {
      horizontal: this.x < 1280 ? 'right' : 'left',
      vertical: this.y < 720 ? 'down' : 'up',
    }
  }

  private async calculateChatPosition() {
    await delay(0) //This is to allow the card position to settle after spawn
    let chatVerticalDirection: ChatVerticalDirection = 'up'
    let chatHorizontalDirection: ChatHorizontalDirection = 'left'

    this.chatBubbleSlice.scaleX = 1
    this.chatBubbleSlice.scaleY = 1

    if (this.x + this.chatBubbleOrigin.x < 1280) {
      chatHorizontalDirection = 'right'
    }
    if (this.y + this.chatBubbleOrigin.y < 720) {
      chatVerticalDirection = 'down'
    }

    if (chatHorizontalDirection === 'right') {
      this.chatBubbleSlice.scaleX = -1
    }
    if (chatVerticalDirection === 'down') {
      this.chatBubbleSlice.scaleY = -1
    }

    this.chatTextView.y = chatVerticalDirection === 'down' ? 20 : -20
    //Compensation for text length
    this.chatBubbleSlice.width = this.chatTextView.getBounds().width + 40
    this.chatBubbleSlice.height = this.chatTextView.getBounds().height + 60

    //Initial position offset to compensate for the bubble
    this.chatBubbleContainer.x =
      -80 +
      this.chatBubbleOrigin.x +
      (chatHorizontalDirection === 'right' ? this.chatBubbleRightOffset : 0)
    this.chatBubbleContainer.y = -130 + this.chatBubbleOrigin.y

    if (chatHorizontalDirection === 'left') {
      this.chatBubbleContainer.x -= this.chatBubbleSlice.width / 2
    } else {
      this.chatBubbleContainer.x += this.chatBubbleSlice.width / 2 - 55
    }

    if (chatVerticalDirection === 'up') {
      this.chatBubbleContainer.y -= this.chatBubbleSlice.height / 2
    } else {
      this.chatBubbleContainer.y += this.chatBubbleSlice.height / 2 - 5
    }
  }

  async playAnimation(animation?: SpawnAnimation) {
    await this.hideChat()
    const resolvedAnimation = animation ?? 'pop_in'

    if (resolvedAnimation === 'none') {
      return
    }

    if (resolvedAnimation === 'fly_in_left') {
      const currentX = this.x
      this.x = 3000

      this.scene.tweens.add({
        targets: this,
        x: currentX,
        duration: 500,
        ease: 'Back.easeOut',
      })
      await delay(500)
      return
    }

    //pop_in is the default animation
    this.setAlpha(0)
    this.scale = 0.2
    this.scene.tweens.add({
      targets: this,
      scale: 1,
      duration: 400,
      ease: 'Back.easeOut',
    })
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 200,
      ease: 'Cubic',
    })
    await delay(410)
  }
}
