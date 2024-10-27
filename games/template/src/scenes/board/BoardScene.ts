import {
  PotatoScene,
  SpriteBuilder,
  createGlobalPositionLabel,
  updateGlobalPositionLabel,
} from '@potato-golem/ui'
import Phaser from 'phaser'

import { createGlobalTrackerLabel, updateGlobalTrackerLabel } from '@potato-golem/ui'
import { EntityModel } from '../../model/EntityModel'
import type { WorldModel } from '../../model/WorldModel'
import type { Dependencies } from '../../model/diConfig'
import { sceneRegistry } from '../../registries/sceneRegistry'
import { EntityView } from './views/EntityView'
import Sprite = Phaser.GameObjects.Sprite
import type { CommonEntity } from '@potato-golem/core'
import { entityDefinitions } from '../../model/definitions/entityDefinitions'
import { EntityTypeRegistry } from '../../model/registries/entityTypeRegistry'
import { imageRegistry } from '../../registries/imageRegistry'
import type { EndTurnProcessor } from '../../model/processors/EndTurnProcessor'

export class BoardScene extends PotatoScene {
  private readonly worldModel: WorldModel

  private globalPositionLabel: Phaser.GameObjects.Text
  private globalTrackerLabel: Phaser.GameObjects.Text

  private backgroundImage: Sprite
  private readonly endTurnProcessor: EndTurnProcessor

  constructor({ worldModel, endTurnProcessor }: Dependencies) {
    super(sceneRegistry.BOARD_SCENE)

    this.worldModel = worldModel
    this.endTurnProcessor = endTurnProcessor
  }

  init() {
    this.addCard()

    this.eventBus.on('DESTROY', (entity: CommonEntity) => {
      if (entity.type === EntityTypeRegistry.DEFAULT) {
        this.worldModel.removeCard(entity.id)
        this.destroyChildByModelId(entity.id)
      }
    })
  }

  addCard() {
    const cardModel = new EntityModel({
      parentEventSink: this.eventBus,
      definition: entityDefinitions.MOLDY_SAUSAGE,
    })
    this.worldModel.addCard(cardModel)

    const cardView = new EntityView(
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
    this.addChildViewObject(cardView)
  }

  preload() {}

  update() {
    updateGlobalPositionLabel(this.globalPositionLabel)
    updateGlobalTrackerLabel(this.globalTrackerLabel)
  }

  create() {
    this.backgroundImage = SpriteBuilder.instance(this)
      .setTextureKey(imageRegistry.ROCKET)
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
