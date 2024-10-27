import { Game } from 'phaser'
import Phaser from 'phaser'
import type { FMOD } from '../lib/fmod/types'
import { AudioSystem } from './core/AudioSystem'
import { initFmod } from './initFmod'
import { instantiateContainer } from './model/diConfig'

const GameResolutions = {
  default: {
    width: 2560,
    height: 1440,
  },
}

const resolution = GameResolutions.default

const container = instantiateContainer()

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: undefined,
  width: resolution.width,
  height: resolution.height,
  plugins: {},
  scene: [container.cradle.mainMenuScene, container.cradle.boardScene, container.cradle.musicScene],
}

export let game: Phaser.Game
export let audioSystem: AudioSystem

initFmod((fmodStudio: FMOD.StudioSystem) => {
  game = new Game(config)
  audioSystem = new AudioSystem(game, fmodStudio)
})
