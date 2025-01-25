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
import { UnitView } from './views/UnitView'
import Sprite = Phaser.GameObjects.Sprite
import type { CommonEntity } from '@potato-golem/core'
import { entityDefinitions } from '../../model/definitions/entityDefinitions'
import type { EndTurnProcessor } from '../../model/processors/EndTurnProcessor'
import { DepthRegistry } from '../../model/registries/depthRegistry'
import { EntityTypeRegistry } from '../../model/registries/entityTypeRegistry'
import { imageRegistry } from '../../registries/imageRegistry'
import { UnitEntity, UnitEntityParams } from '../../model/entities/UnitEntity'

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
    this.addEntity({
      powerValue: 1,
      coords: { x: 1, y: 1},
    })
    this.addEntity({
      powerValue: 2,
      coords: { x: 2, y: 1},
    })
    this.addEntity({
      powerValue: 3,
      coords: { x: 3, y: 1},
    })

    this.eventBus.on('DESTROY', (entity: CommonEntity) => {
      if (entity.type === EntityTypeRegistry.DEFAULT) {
        this.worldModel.removeUnit(entity.id)
        this.destroyChildByModelId(entity.id)
      }
    })
  }

  addEntity(unitParams: UnitEntityParams) {
    const entityModel = new UnitEntity(unitParams)
    this.worldModel.addUnit(entityModel)

    const entityView = new UnitView(
      this,
      {
        model: entityModel,
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
    /*
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

     */

    this.globalPositionLabel = createGlobalPositionLabel(this)
    this.globalTrackerLabel = createGlobalTrackerLabel(this)
  }
}
