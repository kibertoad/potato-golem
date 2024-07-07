import type { ImageBox } from 'phaser3-rex-plugins/templates/ui/ui-components'
import { validateString } from 'validation-utils'
import { PotatoScene } from '../common/PotatoScene'
import { AbstractUIBuilder } from './AbstractUIBuilder'

export class ImageBoxBuilder extends AbstractUIBuilder {
  private textureKey?: string

  public setTextureKey(value: string) {
    this.textureKey = value
    return this
  }

  build(): ImageBox {
    const imageBox: ImageBox = this.scene.add
      // @ts-ignore
      .rexImageBox(this.getX(), this.getY(), validateString(this.textureKey))

      imageBox.width = this.getWidth()
      imageBox.height = this.getHeight()

    return imageBox
  }

  static instance(scene: PotatoScene) {
    return new ImageBoxBuilder(scene)
  }
}
