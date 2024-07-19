import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import { CardModel } from '../../../model/CardModel'
import {
  buildDragWithActivations, type Position,
  PotatoScene, restoreStartPosition, setEntityModel,
  setEntityType,
  SpriteBuilder,
  TextBuilder,
} from '@potato-golem/ui'
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import { ImageRegistry } from '../../../model/registries/imageRegistry'

export type CardViewParams = {
  model: CardModel
} & Position

export type CardViewDependencies = {
}

const textOffsetX = 35
const textOffsetY = 5

export class CardView extends Container {
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

  /**
   * Domain model of the card
   */
  private readonly model: CardModel

  constructor(scene: PotatoScene, params: CardViewParams, dependencies: CardViewDependencies) {
    super(scene)

    this.x = params.x
    this.y = params.y
    this.setDepth(100)

    this.model = params.model

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
      .setTextureKey(ImageRegistry.HEALTH_CARD)
      .setPosition({
        x: 0,
        y: 30,
      })
      .setOrigin(0, 0)
      .setWidth(120)
      .setHeight(140)
      .build()

    this.title = TextBuilder.instance(scene)
      .setRelativePositionFromBackground(this,
        textOffsetX,
        textOffsetY
      )
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

    // Build ticket drag'n'drop
    buildDragWithActivations({
      dragStartItem: this.cardFrameSprite,
      draggedItem: this,
      dropActivations: {
        [EntityTypeRegistry.DEFAULT]: () => {
          // restoreStartPosition(this)
        },
      },
      config: {},
      potentialHoverTargets: [],
      potentialDropTargets: [],
    })
  }
}
