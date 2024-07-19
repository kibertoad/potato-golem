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
   * Static image background for the card
   */
  private readonly sprite: Phaser.GameObjects.Sprite

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

    this.model = params.model

    this.sprite = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.ROCKET)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0, 0)
      .setWidth(200)
      .setHeight(100)
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

    setEntityType(this.sprite, EntityTypeRegistry.CARD)
    setEntityModel(this.sprite, this.model)

    this.add(this.sprite)
    this.add(this.title)

    scene.add.existing(this)

    // Build ticket drag'n'drop
    buildDragWithActivations({
      dragStartItem: this.sprite,
      draggedItem: this,
      dropActivations: {
        [EntityTypeRegistry.DEFAULT]: () => {
          restoreStartPosition(this)
        },
      },
      config: {},
      potentialHoverTargets: [],
      potentialDropTargets: [],
    })
  }
}
