import Phaser, { Game } from 'phaser'
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
  scene: [container.cradle.mainMenuScene, container.cradle.boardScene],
}

// For some reason this must happen in root TS file
new Game(config)
