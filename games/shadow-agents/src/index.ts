import { Game } from 'phaser'
import { normalizedRandom } from '@potato-golem/core'

const randomNumber = normalizedRandom(100)
// biome-ignore lint/suspicious/noConsoleLog: <explanation>
console.log(randomNumber)

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
