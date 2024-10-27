import { SpriteBuilder } from '@potato-golem/ui'
import type { PotatoScene } from '@potato-golem/ui'
import type Phaser from 'phaser'
import { audioSystem } from '../../../..'
import { ImageRegistry } from '../../../../model/registries/imageRegistry'
import { SfxEventRegistry } from '../../../../model/registries/sfxEventRegistry'
import { CardView } from '../CardView'
import { AnimationBase } from './AnimationBase'

export class AnimationBloodSplat extends AnimationBase {
  private readonly cardBloodSplatSprite: Phaser.GameObjects.Sprite

  constructor(scene: PotatoScene) {
    super(scene)

    this.cardBloodSplatSprite = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.BLOOD_1)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(CardView.cardWidth)
      .setHeight(CardView.cardHeight)
      .build()
    this.cardBloodSplatSprite.setVisible(false)
    this.add(this.cardBloodSplatSprite)
  }

  public async play(): Promise<void> {
    this.cardBloodSplatSprite.setAlpha(1)
    this.cardBloodSplatSprite.play('blood_splat')

    audioSystem.playSfx(SfxEventRegistry.SLASH_SPLAT)

    await Promise.all([
      new Promise((resolve) => {
        const tween = this.scene.tweens.add({
          targets: this,
          alpha: 0,
          delay: 400,
          duration: 700,
          ease: 'Cubic',
        })
        tween.on('complete', resolve)
      }),
      new Promise((resolve) => {
        const tween = this.scene.tweens.add({
          targets: this,
          y: this.y + 200,
          delay: 200,
          duration: 1000,
          ease: 'Sine',
        })
        tween.on('complete', resolve)
      }),
    ])
  }
}
