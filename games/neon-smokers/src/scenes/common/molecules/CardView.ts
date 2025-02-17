import Phaser, { Scene } from 'phaser'
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
import type { ChoiceModel } from '../../../model/entities/narrative/ChoiceModel'
import type { EndTurnProcessor } from '../../../model/processors/EndTurnProcessor'
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import { imageRegistry } from '../../../registries/imageRegistry'

export type CardViewParams = {
  model: ChoiceModel
} & Position

export type CardViewDependencies = {

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

  /**
   * Domain model of the card
   */
  private readonly model: ChoiceModel

  constructor(scene: PotatoScene, params: CardViewParams, dependencies: CardViewDependencies) {
    super(scene)

    this.id = params.model.id
    this.x = params.x
    this.y = params.y
    this.setDepth(100)

    this.model = params.model

    this.cardFrameSprite = SpriteBuilder.instance(scene)
      .setTextureKey(imageRegistry.CARD_BACKGROUND)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0, 0)
      .setWidth(120)
      .setHeight(180)
      .build()

    this.cardPictureSprite = SpriteBuilder.instance(scene)
      .setTextureKey(this.model.definition.image)
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

    setEntityType(this.cardFrameSprite, EntityTypeRegistry.DEFAULT)
    setEntityModel(this.cardFrameSprite, this.model)

    this.add(this.cardFrameSprite)
    this.add(this.cardPictureSprite)
    this.add(this.title)

    scene.add.existing(this)
  }
}
