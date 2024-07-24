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

  private readonly hearts: Phaser.GameObjects.Sprite[] = []

  constructor(scene: PotatoScene, dependencies: HomunculusDependencies) {
    super(scene)

    this.model = dependencies.model

    this.homunculusSprite = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.HOMUNCULUS)
      .setPosition({
        x: 1265,
        y: 672,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(350)
      .setHeight(350)
      .setDepth(DepthRegistry.HOMUNCULUS)
      .build()

    for (let i = 0; i < this.model.hp.value; i++) {
      const heart = SpriteBuilder.instance(scene)
        .setTextureKey(ImageRegistry.HOMUNCULUS_HEART)
        .setPosition({
          x: 1230 + i * 50,
          y: 885,
        })
        .setOrigin(0.5, 0.5)
        .setWidth(50)
        .setHeight(50)
        .setDepth(DepthRegistry.HOMUNCULUS)
        .build()

      this.add(heart)
      scene.add.existing(heart)
      this.hearts.push(heart)
    }

    this.add(this.homunculusSprite)
    scene.add.existing(this.homunculusSprite)

    this.model.eventSink.on('HEAL', (_hp: number) => this.updateHpDisplay())
    this.model.eventSink.on('DAMAGE', (_hp: number) => this.updateHpDisplay())
  }

  updateHpDisplay() {
    for (let i = 0; i < this.hearts.length; i++) {
      this.hearts[i].setVisible(i < this.model.hp.value)
    }
  }
}
