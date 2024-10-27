import { SpriteBuilder } from '@potato-golem/ui'
import type { PotatoScene } from '@potato-golem/ui'
import type Phaser from 'phaser'
import { audioSystem } from '../../../..'
import { ImageRegistry } from '../../../../model/registries/imageRegistry'
import { SfxEventRegistry } from '../../../../model/registries/sfxEventRegistry'
import { CardView } from '../CardView'
import { AnimationBase } from './AnimationBase'
export class AnimationExplosion extends AnimationBase {
  private readonly cardExplosionSprite: Phaser.GameObjects.Sprite

  constructor(scene: PotatoScene) {
    super(scene)

    this.cardExplosionSprite = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.EXPLOSION_1)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(CardView.cardWidth)
      .setHeight(CardView.cardHeight)
      .build()
    this.cardExplosionSprite.setVisible(false)
    this.add(this.cardExplosionSprite)
  }

  public async play(): Promise<void> {
    this.cardExplosionSprite.setAlpha(1)
    this.cardExplosionSprite.play('explosion')

    audioSystem.playSfx(SfxEventRegistry.EXPLOSION)

    await new Promise((resolve) => {
      this.cardExplosionSprite.once('animationcomplete', () => {
        const tween = this.scene.tweens.add({
          targets: this.cardExplosionSprite,
          alpha: 0,
          delay: 0,
          duration: 1200,
          ease: 'Cubic',
        })
        tween.on('complete', resolve)
      })
    })
  }
}
