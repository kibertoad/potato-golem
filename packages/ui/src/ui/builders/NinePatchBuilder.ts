import { validateNumber, validateString } from 'validation-utils'
import type { PotatoScene } from '../common/PotatoScene'
import { AbstractUIBuilder } from './AbstractUIBuilder'
import NineSlice = Phaser.GameObjects.NineSlice

export type SliceConfig = {
  width?: number
  height?: number
  leftWidth?: number
  rightWidth?: number
  topHeight?: number
  bottomHeight?: number
  skipScale9?: boolean
}

/**
 * Used for creating images that can stretch by scaling specified sections within specified parameters
 */
export class NinePatchBuilder extends AbstractUIBuilder {
  private textureKey?: string
  private interactiveConfig?: Phaser.Types.Input.InputConfiguration
  private sliceConfig: SliceConfig

  constructor(scene: PotatoScene) {
    super(scene)
    this.sliceConfig = {}
  }

  public setTextureKey(value: string) {
    this.textureKey = value
    return this
  }

  public setSlices(value: SliceConfig): this {
    this.sliceConfig = value
    return this
  }

  public setInteractive(config: Phaser.Types.Input.InputConfiguration) {
    this.interactiveConfig = config
    return this
  }

  build(): NineSlice {
    validateNumber(this.sliceConfig.width)
    validateNumber(this.sliceConfig.height)
    validateNumber(this.sliceConfig.leftWidth)
    validateNumber(this.sliceConfig.rightWidth)
    validateNumber(this.sliceConfig.topHeight)
    validateNumber(this.sliceConfig.bottomHeight)

    const nineSlice = this.scene.add.nineslice(
      this.getX(),
      this.getY(),
      validateString(this.textureKey),
      undefined,
      this.sliceConfig.width,
      this.sliceConfig.height,
      this.sliceConfig.leftWidth,
      this.sliceConfig.rightWidth,
      this.sliceConfig.topHeight,
      this.sliceConfig.bottomHeight,
    )

    if (this.width) {
      nineSlice.setDisplaySize(this.getWidth(), this.getHeight())
    }

    if (this.interactiveConfig) {
      nineSlice.setInteractive(this.interactiveConfig)
    }

    return nineSlice
  }

  static instance(scene: PotatoScene) {
    return new NinePatchBuilder(scene)
  }
}
