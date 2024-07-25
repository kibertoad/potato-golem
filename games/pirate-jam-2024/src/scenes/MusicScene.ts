import { PotatoScene } from '@potato-golem/ui'
import type Phaser from 'phaser'

import { MusicRegistry } from '../model/registries/musicRegistry'
import { SfxRegistry } from '../model/registries/sfxRegistry'
import { Scenes } from './SceneRegistry'

const isMusicEnabled = false

export class MusicScene extends PotatoScene {
  private mainTheme:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
  private boardTheme:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
  private boardThemeIntro:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
  private boardThemeLoop:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound

  constructor() {
    super({
      key: Scenes.MUSIC_SCENE,
      active: true,
    })
  }

  preload() {
    if (isMusicEnabled) {
      this.load.audio(MusicRegistry.MAIN_THEME, require('url:../../assets/music/bg_draft.mp3'))
      this.load.audio(
        MusicRegistry.BOARD_THEME_INTRO,
        require('url:../../assets/music/board_theme_intro.ogg'),
      )
      this.load.audio(
        MusicRegistry.BOARD_THEME_LOOP,
        require('url:../../assets/music/board_theme_loop.ogg'),
      )
    }

    this.load.audio(SfxRegistry.BITE_1, require('url:../../assets/sfx/bite_1.mp3'))
    this.load.audio(SfxRegistry.BITE_2, require('url:../../assets/sfx/bite_2.mp3'))
    this.load.audio(SfxRegistry.BITE_3, require('url:../../assets/sfx/bite_3.mp3'))
    this.load.audio(SfxRegistry.POOF, require('url:../../assets/sfx/poof.mp3'))
  }

  create() {
    if (!isMusicEnabled) {
      return
    }
    this.mainTheme = this.sound.add(MusicRegistry.MAIN_THEME)
    this.mainTheme.volume = 0.4
    this.boardThemeIntro = this.sound.add(MusicRegistry.BOARD_THEME_INTRO)
    this.boardThemeIntro.volume = 0.4
    this.boardThemeLoop = this.sound.add(MusicRegistry.BOARD_THEME_LOOP)
    this.boardThemeLoop.volume = 0.4
  }

  public fadeOutMainTheme() {
    if (!isMusicEnabled) {
      return
    }
    this.tweens.add({
      targets: this.mainTheme,
      volume: 0,
      duration: 100,
      onComplete: () => {
        this.mainTheme.stop()
      },
    })
  }

  public playBoardTheme() {
    if (!isMusicEnabled) {
      return
    }

    this.boardThemeIntro.volume = 0.4
    this.boardThemeIntro.play()
    this.boardThemeIntro.once('complete', () => {
      this.boardThemeLoop.play({
        loop: true,
      })
    })
  }

  public playMainTheme() {
    if (!isMusicEnabled) {
      return
    }

    this.boardThemeIntro.stop()
    this.boardThemeIntro.volume = 0
    this.mainTheme.volume = 0.4
    this.mainTheme.play({
      loop: true,
    })
  }
}
