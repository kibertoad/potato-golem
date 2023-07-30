import { AbstractUIBuilder } from './AbstractUIBuilder'
import { ActivationCallback } from '../activations/ActivationTypes'
import { validateString } from 'validation-utils'
import { PotatoScene } from '../common/PotatoScene'
import { ImageBox } from 'phaser3-rex-plugins/templates/ui/ui-components';

export class ImageBoxBuilder extends AbstractUIBuilder {

  private textureKey?: string

  public setTextureKey(value: string) {
    this.textureKey = value
    return this
  }

  build(): ImageBox {
    // @ts-ignore
    return this.scene.add.rexImageBox(this.getX(), this.getY(), validateString(this.textureKey))
      .resize(this.getWidth(), this.getHeight())
  }

  static instance(scene: PotatoScene) {
    return new ImageBoxBuilder(scene)
  }
}
