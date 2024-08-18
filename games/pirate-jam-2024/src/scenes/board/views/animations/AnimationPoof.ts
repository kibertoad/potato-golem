import { SpriteBuilder } from '@potato-golem/ui'
import type { PotatoScene } from '@potato-golem/ui'
import { audioSystem } from '../../../..'
import { ImageRegistry } from '../../../../model/registries/imageRegistry'
import { SfxEventRegistry } from '../../../../model/registries/sfxEventRegistry'
import { CardView } from '../CardView'
import { AnimationBase } from './AnimationBase'

export class AnimationPoof extends AnimationBase {
  private readonly cardPoofSprite: Phaser.GameObjects.Sprite

  constructor(scene: PotatoScene) {
    super(scene)

    this.cardPoofSprite = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.CLOUD_1)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(CardView.cardWidth)
      .setHeight(CardView.cardHeight)
      .build()
    this.cardPoofSprite.setScale(1.3)
    this.add(this.cardPoofSprite)
  }

  public async play(): Promise<void> {
    this.cardPoofSprite.setAlpha(1)
    this.cardPoofSprite.play('poof')

    audioSystem.playSfx(SfxEventRegistry.POOF)

    await new Promise((resolve) => {
      const tween = this.scene.tweens.add({
        targets: this.cardPoofSprite,
        alpha: 0,
        delay: 60,
        duration: 600,
        ease: 'Cubic',
      })
      tween.on('complete', resolve)
    })
  }
}
