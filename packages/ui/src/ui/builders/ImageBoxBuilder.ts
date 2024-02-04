import { ImageBox } from 'phaser3-rex-plugins/templates/ui/ui-components'
import { validateString } from 'validation-utils'
import { ActivationCallback } from '../activations/ActivationTypes'
import { PotatoScene } from '../common/PotatoScene'
import { AbstractUIBuilder } from './AbstractUIBuilder'

export class ImageBoxBuilder extends AbstractUIBuilder {
  private textureKey?: string

  public setTextureKey(value: string) {
    this.textureKey = value
    return this
  }

  build(): ImageBox {
    return this.scene.add
      // @ts-ignore
      .rexImageBox(this.getX(), this.getY(), validateString(this.textureKey))
      .resize(this.getWidth(), this.getHeight())
  }

  static instance(scene: PotatoScene) {
    return new ImageBoxBuilder(scene)
  }
}
