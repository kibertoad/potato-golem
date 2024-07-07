import { Game } from 'phaser'

const GameResolutions = {
  default: {
    width: 1280,
    height: 720,
  },
}

const resolution = GameResolutions.default

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: undefined,
  width: resolution.width,
  height: resolution.height,
  plugins: {
  },
  scene: [],
}

// For some reason this must happen in root TS file
new Game(config)
