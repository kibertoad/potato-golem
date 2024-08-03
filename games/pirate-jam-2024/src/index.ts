import Phaser, { Game } from 'phaser'
import { instantiateContainer } from './model/diConfig'

const fmodInit = require('../lib/fmodstudio')

const GameResolutions = {
  default: {
    width: 2560,
    height: 1440,
  },
}

const fmod: FMOD = {
	TOTAL_MEMORY: 24 * 1024 * 1024,
	preRun: preRun,
	onRuntimeInitialized : main
};

fmodInit(fmod); // Initialize the fmod object

// === Callbacks ===
function preRun() {
	// not implemented yet
  console.log('preRun')
}

function main() {
	// not implemented yet
  console.log('main')
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

// For some reason this must happen in root TS file
new Game(config)
