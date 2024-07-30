import { PotatoScene } from '@potato-golem/ui'

import { Howl } from 'howler'
import { type SfxId, SfxRegistry } from '../model/registries/sfxRegistry'
import { worldModel } from '../model/state/WorldModel'
import { Scenes } from './SceneRegistry'

const isMusicEnabled = true

const musicVolume = 0.4

export class MusicScene extends PotatoScene {
  private mainTheme: Howl
  private boardThemeIntro: Howl
  private boardThemeLoop: Howl
  private gameOver: Howl
  private sfx: Record<SfxId, Howl> = {} as any

  constructor() {
    super({
      key: Scenes.MUSIC_SCENE,
      active: true,
    })
  }

  preload() {
    this.mainTheme = new Howl({
      preload: true,
      src: [
        require('url:../../assets/music/main_menu.ogg'),
        require('url:../../assets/music/main_menu.aac'),
      ],
      volume: musicVolume,
      loop: true,
    })
    this.boardThemeIntro = new Howl({
      preload: true,
      src: [
        require('url:../../assets/music/board_theme_intro.ogg'),
        require('url:../../assets/music/board_theme_intro.aac'),
      ],
      volume: musicVolume,
    })
    this.boardThemeLoop = new Howl({
      preload: true,
      src: [
        require('url:../../assets/music/board_theme_loop.ogg'),
        require('url:../../assets/music/board_theme_loop.aac'),
      ],
      loop: true,
      volume: musicVolume,
    })
    this.gameOver = new Howl({
      preload: true,
      src: [
        require('url:../../assets/music/game_over_short.ogg'),
        require('url:../../assets/music/game_over_short.aac'),
      ],
      volume: musicVolume,
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
      0.5,
    )
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

  public create() {
    worldModel.musicScene = this
  }

  public stopAll() {
    this.boardThemeLoop.stop()
    this.boardThemeIntro.stop()
    this.boardThemeIntro.off()
    this.mainTheme.stop()
    this.gameOver.stop()
  }

  public playBoardTheme() {
    if (!isMusicEnabled) {
      return
    }

    this.stopAll()

    this.boardThemeIntro.play()
    this.boardThemeIntro.once('end', () => {
      this.boardThemeLoop.play()
      this.boardThemeLoop.volume(musicVolume)
    })
  }

  public playMainTheme() {
    if (!isMusicEnabled) {
      return
    }

    this.stopAll()
    this.mainTheme.play()
  }

  public playGameOver() {
    if (!isMusicEnabled) {
      return
    }

    this.stopAll()
    this.gameOver.play()
  }
}
