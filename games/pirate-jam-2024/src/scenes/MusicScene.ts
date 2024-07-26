import { PotatoScene } from '@potato-golem/ui'

import { Howl } from 'howler'
import { SfxRegistry } from '../model/registries/sfxRegistry'
import { Scenes } from './SceneRegistry'

const isMusicEnabled = true

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
      src: require('url:../../assets/music/bg_draft.mp3'),
      loop: true,
    })
    this.mainTheme.volume(0.4)
    this.boardThemeIntro = new Howl({
      src: require('url:../../assets/music/board_theme_intro.ogg'),
    })
    this.boardThemeIntro.volume(0.4)
    this.boardThemeLoop = new Howl({
      src: require('url:../../assets/music/board_theme_loop.ogg'),
      loop: true,
    })
    this.boardThemeLoop.volume(0.4)
    this.gameOver = new Howl({
      src: require('url:../../assets/music/game_over_short.ogg'),
    })
    this.gameOver.volume(0.4)

    this.load.audio(SfxRegistry.BITE_1, require('url:../../assets/sfx/bite_1.mp3'))
    this.load.audio(SfxRegistry.BITE_2, require('url:../../assets/sfx/bite_2.mp3'))
    this.load.audio(SfxRegistry.BITE_3, require('url:../../assets/sfx/bite_3.mp3'))
    this.load.audio(SfxRegistry.POOF, require('url:../../assets/sfx/poof.mp3'))
  }

  public stopAll() {
    this.boardThemeLoop.stop()
    this.boardThemeIntro.stop()
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
