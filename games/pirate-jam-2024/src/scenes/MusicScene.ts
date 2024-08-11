import { PotatoScene } from '@potato-golem/ui'

import { SpriteBuilder } from '@potato-golem/ui'
import { audioSystem } from '..'
import { DepthRegistry } from '../model/registries/depthRegistry'
import { ImageRegistry } from '../model/registries/imageRegistry'
import { worldModel } from '../model/state/WorldModel'
import { Scenes } from './SceneRegistry'

export class MusicScene extends PotatoScene {
  private toggleMusicSprite: Phaser.GameObjects.Sprite

  private musicVolume = 0.2
  private muteMusic = false

  constructor() {
    super({
      key: Scenes.MUSIC_SCENE,
      active: true,
    })
  }

  preload() {
    this.muteMusic = (localStorage.getItem('muteMusic') || 'on') === 'off'

    this.load.image(ImageRegistry.MUSIC, require('../../assets/img/music_light.png'))
  }

  public changeMusicVolume(volume: number) {
    this.musicVolume = volume
    audioSystem.setMusicVolume(volume)
  }

  public toggleMusic() {
    this.musicVolume = this.musicVolume === 0 ? 0.2 : 0
    this.changeMusicVolume(this.musicVolume)
    this.toggleMusicSprite.setAlpha(this.musicVolume === 0 ? 0.5 : 1)

    localStorage.setItem('muteMusic', this.musicVolume === 0 ? 'off' : 'on')
  }

  public create() {
    worldModel.musicScene = this

    this.toggleMusicSprite = SpriteBuilder.instance(this)
      .setTextureKey(ImageRegistry.MUSIC)
      .setPosition({
        x: 2510,
        y: 40,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(45)
      .setHeight(48)
      .build()

    if (this.muteMusic) {
      this.toggleMusic()
    }

    this.toggleMusicSprite
      .setInteractive({
        useHandCursor: true,
      })
      .on('pointerdown', () => {
        this.toggleMusic()
      })
    this.toggleMusicSprite.setDepth(DepthRegistry.GAME_OVER - 1)
    this.add.existing(this.toggleMusicSprite)
  }

  update() {
    audioSystem.update()
  }
}
