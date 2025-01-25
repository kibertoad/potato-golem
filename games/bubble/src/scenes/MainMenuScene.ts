import { PrefabMainMenuScene } from '@potato-golem/prefab-scenes'
import { imageRegistry } from '../registries/imageRegistry'
import { type SceneId, sceneRegistry } from '../registries/sceneRegistry'

const isMusicEnabled = false

export class MainMenuScene extends PrefabMainMenuScene<SceneId> {
  constructor() {
    super({
      buttonTextureKey: imageRegistry.ROCKET,
      credits: [],
      gameStartScene: sceneRegistry.BOARD_SCENE,
      mainMenuSceneId: sceneRegistry.MAIN_MENU_SCENE,
      subtitleText: 'Bubble',
    })
  }

  preloadImages(): void {
    this.load.image(imageRegistry.ROCKET, require('../../assets/img/favicon.png'))
    this.load.image(imageRegistry.TERRAIN, require('../../assets/img/terrain.png'))
    this.load.image(imageRegistry.UNIT_5, require('../../assets/img/5.png'))
  }
}
