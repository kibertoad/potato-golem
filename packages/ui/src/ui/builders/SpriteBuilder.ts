import { validateString } from 'validation-utils'
import  type { PotatoScene } from '../common/PotatoScene'
import { AbstractUIBuilder } from './AbstractUIBuilder'
import Sprite = Phaser.GameObjects.Sprite
import Phaser from 'phaser'

/**
 * Create a static image
 */
export class SpriteBuilder extends AbstractUIBuilder {
  private textureKey?: string
  private interactiveConfig?: Phaser.Types.Input.InputConfiguration


  constructor(scene: PotatoScene) {
    super(scene)

    this.setOrigin(0, 0)
  }

  public setTextureKey(value: string) {
    this.textureKey = value
    return this
  }

  public setInteractive(config: Phaser.Types.Input.InputConfiguration) {
    this.interactiveConfig = config
    return this
  }

  build(): Sprite {
    const sprite = this.scene.add
      .sprite(this.getX(), this.getY(), validateString(this.textureKey))
      .setDepth(this.depth ?? 0)
      .setOrigin(this.originX, this.originY)
      .setDisplaySize(this.getWidth(), this.getHeight())
    if (this.interactiveConfig) {
      sprite.setInteractive(this.interactiveConfig)
    }

    return sprite
  }

  static instance(scene: PotatoScene) {
    return new SpriteBuilder(scene)
  }
}
