import { PotatoScene, createGlobalPositionLabel, updateGlobalPositionLabel } from '@potato-golem/ui'
import Phaser from 'phaser'

import { createGlobalTrackerLabel, updateGlobalTrackerLabel } from '@potato-golem/ui'
import type { Dependencies } from '../../model/diConfig'
import type { WorldModel } from '../../model/entities/WorldModel'
import { sceneRegistry } from '../../registries/sceneRegistry'
import { UnitView } from './views/UnitView'
import Sprite = Phaser.GameObjects.Sprite
import type { CommonEntity } from '@potato-golem/core'
import { UnitEntityModel, type UnitEntityParams } from '../../model/entities/UnitEntityModel'
import type { EndTurnProcessor } from '../../model/processors/EndTurnProcessor'
import { EntityTypeRegistry } from '../../model/registries/entityTypeRegistry'
import { BOARD_SIZE } from './BoardConstants'
import type { MovementProcessor } from './processors/MovementProcessor'
import { TerrainView, type TerrainViewParams } from './views/TerrainView'

export class BoardScene extends PotatoScene {
  private readonly worldModel: WorldModel
  public selectedUnit: UnitView

  private globalPositionLabel: Phaser.GameObjects.Text
  private globalTrackerLabel: Phaser.GameObjects.Text

  private backgroundImage: Sprite
  private readonly endTurnProcessor: EndTurnProcessor
  private readonly movementProcessor: MovementProcessor

  constructor({ worldModel, endTurnProcessor, movementProcessor }: Dependencies) {
    super(sceneRegistry.BOARD_SCENE)

    this.worldModel = worldModel
    this.endTurnProcessor = endTurnProcessor
    this.movementProcessor = movementProcessor
  }

  init() {
    // generate terrain
    for (let x = 0; x <= BOARD_SIZE.width; x++) {
      for (let y = 0; y <= BOARD_SIZE.height; y++) {
        this.addTerrain({
          image: 'terrain',
          coords: {
            x,
            y,
          },
        }) // Call the method for each tile position
      }
    }

    let counter = 0
    for (let y = 0; y < 2; y++) {
    for (let x = 1; x <= BOARD_SIZE.width; x++) {
        counter++
        this.addEntity({
          powerValue: counter,
          coords: { x: x, y: BOARD_SIZE.height - y },
          side: 'RED',
        })
      }
    }

    counter = 0
    for (let y = 1; y < 3; y++) {
      for (let x = 1; x <= BOARD_SIZE.width; x++) {
        counter++
        this.addEntity({
          powerValue: counter,
          coords: { x: x, y: y },
          side: 'BLUE',
        })
      }
    }

    /*
    this.eventBus.on('DESTROY', (entity: CommonEntity) => {
      if (entity.type === EntityTypeRegistry.DEFAULT) {
        this.worldModel.removeUnit(entity)
        this.destroyChildByModelId(entity.id)
      }
    })
     */
  }

  addTerrain(terrainParams: TerrainViewParams) {
    const terrainView = new TerrainView(this, terrainParams, {
      worldModel: this.worldModel,
      movementProcessor: this.movementProcessor,
    })

    this.addChildViewObject(terrainView)
  }

  addEntity(unitParams: UnitEntityParams) {
    const entityModel = new UnitEntityModel(unitParams)

    const entityView = new UnitView(
      this,
      {
        model: entityModel,
      },
      {
        worldModel: this.worldModel,
        movementProcessor: this.movementProcessor,
      },
    )
    this.worldModel.addUnit(entityView)
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
