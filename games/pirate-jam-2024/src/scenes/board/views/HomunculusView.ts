import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import { type PotatoScene, SpriteBuilder } from '@potato-golem/ui'
import type { HomunculusModel } from '../../../model/entities/HomunculusModel'
import { DepthRegistry } from '../../../model/registries/depthRegistry'
import { ImageRegistry } from '../../../model/registries/imageRegistry'

export type HomunculusDependencies = {
  model: HomunculusModel
}

export class HomunculusView extends Container {
  private readonly model: HomunculusModel

  private readonly homunculusSprite: Phaser.GameObjects.Sprite

  constructor(scene: PotatoScene, dependencies: HomunculusDependencies) {
    super(scene)

    this.model = dependencies.model

    this.homunculusSprite = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.HOMUNCULUS)
      .setPosition({
        x: 1250,
        y: 670,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(350)
      .setHeight(350)
      .setDepth(DepthRegistry.HOMUNCULUS)
      .build()

    this.add(this.homunculusSprite)
    scene.add.existing(this.homunculusSprite)
  }
}
