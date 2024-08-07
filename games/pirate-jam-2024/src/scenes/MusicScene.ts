import { PotatoScene } from '@potato-golem/ui'

import { SpriteBuilder } from '@potato-golem/ui'
import { Howl } from 'howler'
import { DepthRegistry } from '../model/registries/depthRegistry'
import { ImageRegistry } from '../model/registries/imageRegistry'
import { type SfxId, SfxRegistry } from '../model/registries/sfxRegistry'
import { worldModel } from '../model/state/WorldModel'
import { Scenes } from './SceneRegistry'

export class MusicScene extends PotatoScene {
  private mainTheme: Howl
  private boardThemeIntro: Howl
  private boardThemeLoop: Howl
  private gameOver: Howl
  private sfx: Record<SfxId, Howl> = {} as any

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

    this.mainTheme = new Howl({
      preload: true,
      src: [
        require('url:../../assets/music/main_menu.ogg'),
        require('url:../../assets/music/main_menu.aac'),
      ],
      volume: this.musicVolume,
      loop: true,
    })
    this.boardThemeIntro = new Howl({
      preload: true,
      src: [
        require('url:../../assets/music/board_theme_intro.ogg'),
        require('url:../../assets/music/board_theme_intro.aac'),
      ],
      volume: this.musicVolume,
    })
    this.boardThemeLoop = new Howl({
      preload: true,
      src: [
        require('url:../../assets/music/board_theme_loop.ogg'),
        require('url:../../assets/music/board_theme_loop.aac'),
      ],
      loop: true,
      volume: this.musicVolume,
    })
    this.gameOver = new Howl({
      preload: true,
      src: [
        require('url:../../assets/music/game_over_short.ogg'),
        require('url:../../assets/music/game_over_short.aac'),
      ],
      volume: this.musicVolume,
    })

    this.loadSfx(
      SfxRegistry.CARD_1,
      [require('url:../../assets/sfx/card_1.ogg'), require('url:../../assets/sfx/card_1.aac')],
      0.4,
    )
    this.loadSfx(
      SfxRegistry.CARD_2,
      [
        //0.4
        require('url:../../assets/sfx/card_2.ogg'),
        require('url:../../assets/sfx/card_2.aac'),
      ],
      0.4,
    )
    this.loadSfx(
      SfxRegistry.CARD_3,
      [require('url:../../assets/sfx/card_3.ogg'), require('url:../../assets/sfx/card_3.aac')],
      0.4,
    )
    this.loadSfx(
      SfxRegistry.CARD_4,
      [require('url:../../assets/sfx/card_4.ogg'), require('url:../../assets/sfx/card_4.aac')],
      0.4,
    )
    this.loadSfx(SfxRegistry.BITE_1, [
      require('url:../../assets/sfx/bite_1.ogg'),
      require('url:../../assets/sfx/bite_1.aac'),
    ])
    this.loadSfx(SfxRegistry.BITE_2, [
      require('url:../../assets/sfx/bite_2.ogg'),
      require('url:../../assets/sfx/bite_2.aac'),
    ])
    this.loadSfx(SfxRegistry.BITE_3, [
      require('url:../../assets/sfx/bite_3.ogg'),
      require('url:../../assets/sfx/bite_3.aac'),
    ])
    this.loadSfx(
      SfxRegistry.SLASH_SPLAT_1,
      [
        require('url:../../assets/sfx/slash_splat_1.ogg'),
        require('url:../../assets/sfx/slash_splat_1.aac'),
      ],
      0.6,
    )
    this.loadSfx(
      SfxRegistry.SLASH_SPLAT_2,
      [
        require('url:../../assets/sfx/slash_splat_2.ogg'),
        require('url:../../assets/sfx/slash_splat_2.aac'),
      ],
      0.6,
    )
    this.loadSfx(SfxRegistry.POOF, [
      require('url:../../assets/sfx/poof.ogg'),
      require('url:../../assets/sfx/poof.aac'),
    ])
    this.loadSfx(
      SfxRegistry.LIGHT_UP,
      [require('url:../../assets/sfx/light_up.ogg'), require('url:../../assets/sfx/light_up.aac')],
      0.4,
    )
    this.loadSfx(
      SfxRegistry.PUT_OUT,
      [require('url:../../assets/sfx/put_out.ogg'), require('url:../../assets/sfx/put_out.aac')],
      0.6,
    )
    this.loadSfx(
      SfxRegistry.EXPLOSION,
      [
        require('url:../../assets/sfx/explosion.ogg'),
        require('url:../../assets/sfx/explosion.aac'),
      ],
      1,
    )
  }

  public changeMusicVolume(volume: number) {
    this.musicVolume = volume
    this.mainTheme.volume(this.musicVolume)
    this.boardThemeIntro.volume(this.musicVolume)
    this.boardThemeLoop.volume(this.musicVolume)
    this.gameOver.volume(this.musicVolume)
  }

  public toggleMusic() {
    this.musicVolume = this.musicVolume === 0 ? 0.2 : 0
    this.changeMusicVolume(this.musicVolume)
    this.toggleMusicSprite.setAlpha(this.musicVolume === 0 ? 0.5 : 1)

    localStorage.setItem('muteMusic', this.musicVolume === 0 ? 'off' : 'on')
  }

  public loadSfx(sfxId: SfxId, src: string | string[], volume = 1) {
    this.sfx[sfxId] = new Howl({
      preload: true,
      src: src,
      volume: volume,
    })
  }

  public playSfx(sfxId: SfxId) {
    this.sfx[sfxId]?.play()
  }

  public stopAll() {
    this.boardThemeLoop.stop()
    this.boardThemeIntro.stop()
    this.boardThemeIntro.off()
    this.mainTheme.stop()
    this.gameOver.stop()
  }

  public playBoardTheme() {
    this.stopAll()

    this.boardThemeIntro.play()
    this.boardThemeIntro.once('end', () => {
      this.boardThemeLoop.play()
      this.boardThemeLoop.volume(this.musicVolume)
    })
  }

  public playMainTheme() {
    this.stopAll()
    this.mainTheme.play()
  }

  public playGameOver() {
    this.stopAll()
    this.gameOver.play()
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
}
