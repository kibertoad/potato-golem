import {
  PotatoScene,
  SpriteBuilder,
  createGlobalPositionLabel,
  updateGlobalPositionLabel,
} from '@potato-golem/ui'
import Phaser from 'phaser'

import { createGlobalTrackerLabel, updateGlobalTrackerLabel } from '@potato-golem/ui'
import { EntityModel } from '../../model/entities/EntityModel'
import type { WorldModel } from '../../model/entities/WorldModel'
import type { Dependencies } from '../../model/diConfig'
import { sceneRegistry } from '../../registries/sceneRegistry'
import { EntityView } from './views/EntityView'
import Sprite = Phaser.GameObjects.Sprite
import type { CommonEntity } from '@potato-golem/core'
import { entityDefinitions } from '../../model/definitions/entityDefinitions'
import type { EndTurnProcessor } from '../../model/processors/EndTurnProcessor'
import { DepthRegistry } from '../../model/registries/depthRegistry'
import { EntityTypeRegistry } from '../../model/registries/entityTypeRegistry'
import { imageRegistry } from '../../registries/imageRegistry'

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
    this.addEntity()

    this.eventBus.on('DESTROY', (entity: CommonEntity) => {
      if (entity.type === EntityTypeRegistry.DEFAULT) {
        this.worldModel.removeEntity(entity.id)
        this.destroyChildByModelId(entity.id)
      }
    })
  }

  addEntity() {
    const entityModel = new EntityModel({
      parentEventSink: this.eventBus,
      definition: entityDefinitions.sausage,
    })
    this.worldModel.addEntity(entityModel)

    const entityView = new EntityView(
      this,
      {
        model: entityModel,
        x: 0,
        y: 0,
      },
      {
        endTurnProcessor: this.endTurnProcessor,
      },
    )
    this.addChildViewObject(entityView)
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
      .setDepth(DepthRegistry.BOARD_BACKGROUND)
      .setDimensions({
        width: 1900,
        height: 900,
      })
      .build()

    this.globalPositionLabel = createGlobalPositionLabel(this)
    this.globalTrackerLabel = createGlobalTrackerLabel(this)
  }
}
