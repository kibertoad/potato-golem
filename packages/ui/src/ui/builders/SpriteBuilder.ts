import { AbstractUIBuilder } from './AbstractUIBuilder'
import { validateString } from 'validation-utils'
import { PotatoScene } from '../common/PotatoScene'
import Sprite = Phaser.GameObjects.Sprite

export class SpriteBuilder extends AbstractUIBuilder {

  private textureKey?: string
  private interactiveConfig?: Phaser.Types.Input.InputConfiguration

  public setTextureKey(value: string) {
    this.textureKey = value
    return this
  }

  public setInteractive(config: Phaser.Types.Input.InputConfiguration) {
    this.interactiveConfig = config
    return this
  }

  build(): Sprite {
    const sprite = this.scene.add.sprite(this.getX(), this.getY(), validateString(this.textureKey))
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
