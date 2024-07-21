import { PotatoScene } from '@potato-golem/ui'
import type Phaser from 'phaser'

import { MusicRegistry } from '../model/registries/musicRegistry'
import { Scenes } from './SceneRegistry'

const isMusicEnabled = true

export class MusicScene extends PotatoScene {
  private mainTheme:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
  private boardTheme:
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
      this.load.audio(MusicRegistry.BOARD_THEME, require('url:../../assets/music/board_draft.mp3'))
    }
  }

  create() {
    if (!isMusicEnabled) {
      return
    }
    this.mainTheme = this.sound.add(MusicRegistry.MAIN_THEME)
    this.mainTheme.volume = 0.4
    this.boardTheme = this.sound.add(MusicRegistry.BOARD_THEME)
    this.boardTheme.volume = 0.4

    this.mainTheme.play({
      loop: true,
    })
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

    this.boardTheme.play({
      loop: true,
    })
  }
}
