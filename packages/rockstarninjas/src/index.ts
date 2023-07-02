import { Game } from 'phaser'
import { MainMenuScene } from './scenes/MainMenuScene'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import RexImageBoxPlugin from 'phaser3-rex-plugins/plugins/imagebox-plugin.js'
import { BoardScene } from './scenes/BoardScene'

const GameResolutions = {
  default: {
    width: 1280,
    height: 720,
  }
}

const resolution = GameResolutions.default

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: undefined,
  width: resolution.width,
  height: resolution.height,
  plugins: {
    global: [{
      key: 'rexImageBoxPlugin',
      plugin: RexImageBoxPlugin,
      start: true
    },
      ],
    scene: [{
      key: 'rexUI',
      plugin: RexUIPlugin,
      mapping: 'rexUI',
    },
    ],
  },
  scene: [
    new MainMenuScene(),
    new BoardScene(),
  ],
}

// For some reason this must happen in root TS file
new Game(config)

console.log('End of TS file')
