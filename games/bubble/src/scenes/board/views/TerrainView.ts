import Container = Phaser.GameObjects.Container
import { type Coords, type IdHolder, generateUuid } from '@potato-golem/core'
import {
  type ClickableElementHolder,
  type PotatoScene,
  SpriteBuilder,
  type ViewListener,
  addOnClickActivation,
  calculateViewPosition,
} from '@potato-golem/ui'
import Phaser from 'phaser'
import type { WorldModel } from '../../../model/entities/WorldModel'
import { DepthRegistry } from '../../../model/registries/depthRegistry'
import type { ImageId } from '../../../registries/imageRegistry'
import { TILE_DIMENSIONS } from '../BoardConstants'
import type { MovementProcessor } from '../processors/MovementProcessor'

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

  constructor(
    scene: PotatoScene,
    params: TerrainViewParams,
    dependencies: TerrainViewDependencies,
  ) {
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
      this.movementProcessor.tryMoveToTile(this.worldModel.selectedUnit, this.mapCoords)
    })

    scene.add.existing(this)
  }
}
