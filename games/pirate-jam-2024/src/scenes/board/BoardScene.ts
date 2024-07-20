import {
  PotatoScene,
  SpriteBuilder,
  createGlobalPositionLabel,
  updateGlobalPositionLabel,
} from '@potato-golem/ui'
import Phaser from 'phaser'

import { createGlobalTrackerLabel, updateGlobalTrackerLabel } from '@potato-golem/ui'
import { CardModel } from '../../model/CardModel'
import type { WorldModel } from '../../model/WorldModel'
import type { Dependencies } from '../../model/diConfig'
import { Scenes } from '../SceneRegistry'
import { CardView } from './views/CardView'
import Sprite = Phaser.GameObjects.Sprite
import { type CommonEntity, removeFromArrayById } from '@potato-golem/core'
import { cardDefinitions } from '../../model/definitions/cardDefinitions'
import { EntityTypeRegistry } from '../../model/registries/entityTypeRegistry'
import { ImageRegistry } from '../../model/registries/imageRegistry'
import { EndTurnProcessor } from '../../model/processors/EndTurnProcessor'

export class BoardScene extends PotatoScene {
  private readonly worldModel: WorldModel

  private globalPositionLabel: Phaser.GameObjects.Text
  private globalTrackerLabel: Phaser.GameObjects.Text

  private backgroundImage: Sprite
  private readonly cardViews: CardView[] = []
  private readonly endTurnProcessor: EndTurnProcessor

  constructor({ worldModel, endTurnProcessor }: Dependencies) {
    super(Scenes.BOARD_SCENE)

    this.worldModel = worldModel
    this.endTurnProcessor = endTurnProcessor
  }

  init() {
    this.addCard()

    this.eventBus.on('DESTROY', (entity: CommonEntity) => {
      if (entity.type === EntityTypeRegistry.CARD) {
        this.removeCard(entity.id)
      }
    })
  }

  removeCard(cardModelId: string) {
    this.worldModel.removeCard(cardModelId)

    const cardView = removeFromArrayById(this.cardViews, cardModelId)
    cardView.destroy()
  }

  addCard() {
    const cardModel = new CardModel({
      parentEventSink: this.eventBus,
      zone: 'homunculus',
      definition: cardDefinitions.MOLDY_SAUSAGE,
    })
    this.worldModel.addCard(cardModel)

    const cardView = new CardView(
      this,
      {
        model: cardModel,
        x: 0,
        y: 0,
      },
      {
        endTurnProcessor: this.endTurnProcessor,
      },
    )
    this.cardViews.push(cardView)
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
      .setDepth(50)
      .setDimensions({
        width: 1900,
        height: 900,
      })
      .build()

    this.globalPositionLabel = createGlobalPositionLabel(this)
    this.globalTrackerLabel = createGlobalTrackerLabel(this)
  }
}
