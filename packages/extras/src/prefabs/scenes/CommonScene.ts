import type { Scene } from 'phaser'
import { AbstractBlock } from '../../blocks/AbstractBlock'
import { InputBlock } from '../../blocks/InputBlock'

export class CommonScene extends AbstractBlock {
  public readonly input: InputBlock

  public constructor(scene: Phaser.Scene) {
    super(scene)

    this.input = new InputBlock(scene)
    if (!this.scene) {
      throw new Error('Scene not set')
    }
  }

  public getScene(): Scene {
    console.log('Get scene')
    if (!this.scene) {
      throw new Error('Scene not set')
    }
    return this.scene
  }
}
