import { AbstractUIBuilder } from './AbstractUIBuilder'
import { ActivationCallback } from '../activations/ActivationTypes'
import { validateString } from 'validation-utils'

export class ImageBoxBuilder extends AbstractUIBuilder {

  private textureKey?: string

  public setTextureKey(value: string) {
    this.textureKey = value
    return this
  }

  build() {
    // @ts-ignore
    return this.scene.add.rexImageBox(this.getX(), this.getY(), validateString(this.textureKey))
      .resize(this.getWidth(), this.getHeight())
  }

}