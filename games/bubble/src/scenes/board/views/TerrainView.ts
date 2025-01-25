import Container = Phaser.GameObjects.Container
import { Coords, generateUuid, IdHolder } from '@potato-golem/core'
import Phaser from 'phaser'
import { calculateViewPosition, PotatoScene, SpriteBuilder } from '@potato-golem/ui'
import { ImageId } from '../../../registries/imageRegistry'
import { TILE_DIMENSIONS } from '../BoardConstants'
import { DepthRegistry } from '../../../model/registries/depthRegistry'

export type TerrainViewParams = {
  image: ImageId
  coords: Coords
}

export class TerrainView extends Container implements IdHolder {
  private readonly terrainSprite: Phaser.GameObjects.Sprite
  public readonly id: string

  constructor(scene: PotatoScene, params: TerrainViewParams) {
    super(scene)

    const viewCoords = calculateViewPosition(params.coords, TILE_DIMENSIONS)
    this.id = generateUuid()
    this.x = viewCoords.displayX
    this.y = viewCoords.displayY
    this.setDepth(DepthRegistry.BOARD_BACKGROUND)

    this.terrainSprite = SpriteBuilder.instance(scene)
      .setTextureKey(params.image)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0, 0)
      .setWidth(TILE_DIMENSIONS.width)
      .setHeight(TILE_DIMENSIONS.height)
      .build()

    this.add(this.terrainSprite)
    scene.add.existing(this)
  }
}
