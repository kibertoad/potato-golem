import {
  PotatoScene,
  createGlobalPositionLabel,
  updateGlobalPositionLabel, addOnClickActivation,
} from '@potato-golem/ui'
import Phaser from 'phaser'

import { createGlobalTrackerLabel, updateGlobalTrackerLabel } from '@potato-golem/ui'
import type { WorldModel } from '../../model/entities/WorldModel'
import type { Dependencies } from '../../model/diConfig'
import { sceneRegistry } from '../../registries/sceneRegistry'
import { UnitView } from './views/UnitView'
import Sprite = Phaser.GameObjects.Sprite
import type { CommonEntity } from '@potato-golem/core'
import type { EndTurnProcessor } from '../../model/processors/EndTurnProcessor'
import { EntityTypeRegistry } from '../../model/registries/entityTypeRegistry'
import { UnitEntityModel, UnitEntityParams } from '../../model/entities/UnitEntityModel'
import { TerrainView, TerrainViewParams } from './views/TerrainView'
import { BOARD_SIZE } from './BoardConstants'


export class BoardScene extends PotatoScene {
  private readonly worldModel: WorldModel
  public selectedUnit: UnitView

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

    for (let x = 0; x <= BOARD_SIZE.width; x++) {
      for (let y = 0; y <= BOARD_SIZE.height; y++) {
        this.addTerrain({
          image: 'terrain',
          coords: {
            x,
            y
          }
        }); // Call the method for each tile position
      }
    }

    this.eventBus.on('DESTROY', (entity: CommonEntity) => {
      if (entity.type === EntityTypeRegistry.DEFAULT) {
        this.worldModel.removeUnit(entity.id)
        this.destroyChildByModelId(entity.id)
      }
    })
  }

  addTerrain(terrainParams: TerrainViewParams) {
    const terrainView = new TerrainView(this, terrainParams, {
      worldModel: this.worldModel
    })

    this.addChildViewObject(terrainView)
  }

  addEntity(unitParams: UnitEntityParams) {
    const entityModel = new UnitEntityModel(unitParams)
    this.worldModel.addUnit(entityModel)

    const entityView = new UnitView(
      this,
      {
        model: entityModel,
      },
      {
        worldModel: this.worldModel,
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
