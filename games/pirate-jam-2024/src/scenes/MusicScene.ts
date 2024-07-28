import { PotatoScene } from '@potato-golem/ui'

import { Howl } from 'howler'
import { SfxRegistry } from '../model/registries/sfxRegistry'
import { Scenes } from './SceneRegistry'

const isMusicEnabled = false

const musicVolume = 0.4

export class MusicScene extends PotatoScene {
  private mainTheme: Howl
  private boardThemeIntro: Howl
  private boardThemeLoop: Howl
  private gameOver: Howl

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

    this.load.audio(
      SfxRegistry.CARD_1,
      [require('url:../../assets/sfx/card_1.ogg'), require('url:../../assets/sfx/card_1.aac')],
      {
        volume: 0.5,
      },
    )
    this.load.audio(SfxRegistry.CARD_2, [
      require('url:../../assets/sfx/card_2.ogg'),
      require('url:../../assets/sfx/card_2.aac'),
    ])
    this.load.audio(SfxRegistry.CARD_3, [
      require('url:../../assets/sfx/card_3.ogg'),
      require('url:../../assets/sfx/card_3.aac'),
    ])
    this.load.audio(SfxRegistry.CARD_4, [
      require('url:../../assets/sfx/card_4.ogg'),
      require('url:../../assets/sfx/card_4.aac'),
    ])
    this.load.audio(SfxRegistry.BITE_1, [
      require('url:../../assets/sfx/bite_1.ogg'),
      require('url:../../assets/sfx/bite_1.aac'),
    ])
    this.load.audio(SfxRegistry.BITE_2, [
      require('url:../../assets/sfx/bite_2.ogg'),
      require('url:../../assets/sfx/bite_2.aac'),
    ])
    this.load.audio(SfxRegistry.BITE_3, [
      require('url:../../assets/sfx/bite_3.ogg'),
      require('url:../../assets/sfx/bite_3.aac'),
    ])
    this.load.audio(SfxRegistry.POOF, [
      require('url:../../assets/sfx/poof.ogg'),
      require('url:../../assets/sfx/poof.aac'),
    ])
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
