import { Game } from 'phaser'
import RexImageBoxPlugin from 'phaser3-rex-plugins/plugins/imagebox-plugin.js'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import { BoardScene } from './scenes/board/BoardScene'
import { MainMenuScene } from './scenes/main-menu/MainMenuScene'
import { instantiateContainer } from './model/diConfig'

const GameResolutions = {
  default: {
    width: 1280,
    height: 720,
  },
}

const resolution = GameResolutions.default

const container = instantiateContainer()

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: undefined,
  width: resolution.width,
  height: resolution.height,
  plugins: {
    global: [
      {
        key: 'rexImageBoxPlugin',
        plugin: RexImageBoxPlugin,
        start: true,
      },
    ],
    scene: [
      {
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI',
      },
    ],
  },
  scene: [container.cradle.mainMenuScene, container.cradle.boardScene],
}

// For some reason this must happen in root TS file
new Game(config)
