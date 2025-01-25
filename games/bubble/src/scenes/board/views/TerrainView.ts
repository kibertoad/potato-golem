import Container = Phaser.GameObjects.Container
import { Coords, generateUuid, IdHolder } from '@potato-golem/core'
import Phaser from 'phaser'
import {
  addOnClickActivation,
  calculateViewPosition,
  ClickableElementHolder,
  PotatoScene,
  SpriteBuilder,
  ViewListener,
} from '@potato-golem/ui'
import { ImageId } from '../../../registries/imageRegistry'
import { TILE_DIMENSIONS } from '../BoardConstants'
import { DepthRegistry } from '../../../model/registries/depthRegistry'
import { WorldModel } from '../../../model/entities/WorldModel'
import { UnitView } from './UnitView'
import { MovementProcessor } from '../processors/MovementProcessor'

export type TerrainViewParams = {
  image: ImageId
  coords: Coords
}

export type TerrainViewDependencies = {
  worldModel: WorldModel
  movementProcessor: MovementProcessor
}

export class TerrainView extends Container implements IdHolder, ClickableElementHolder {
  public readonly id: string

  private readonly terrainSprite: Phaser.GameObjects.Sprite
  private readonly worldModel: WorldModel
  private readonly mapCoords: Coords
  private readonly movementProcessor: MovementProcessor

  getClickableElement(): ViewListener {
    return this.terrainSprite
  }

  constructor(scene: PotatoScene, params: TerrainViewParams, dependencies: TerrainViewDependencies) {
    super(scene)
    this.worldModel = dependencies.worldModel
    this.movementProcessor = dependencies.movementProcessor

    const viewCoords = calculateViewPosition(params.coords, TILE_DIMENSIONS)
    this.id = generateUuid()
    this.x = viewCoords.displayX
    this.y = viewCoords.displayY
    this.mapCoords = params.coords

    this.setDepth(DepthRegistry.BOARD_BACKGROUND)

    this.terrainSprite = SpriteBuilder.instance(scene)
      .setTextureKey(params.image)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setInteractive({
        draggable: false,
      })
      .setOrigin(0, 0)
      .setDepth(DepthRegistry.BOARD_BACKGROUND)
      .setWidth(TILE_DIMENSIONS.width)
      .setHeight(TILE_DIMENSIONS.height)
      .build()

    this.add(this.terrainSprite)

    addOnClickActivation(this.getClickableElement(), () => {
      console.log('try moving')
      this.movementProcessor.tryMoveToTile(
        this.worldModel.selectedUnit,
        this.mapCoords,
      )
    })

    scene.add.existing(this)
  }
}
