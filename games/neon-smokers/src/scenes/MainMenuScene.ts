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
      subtitleText: 'Neon smokers',
    })
  }

  preloadImages(): void {
    this.load.image(imageRegistry.ROCKET, require('../../assets/img/favicon.png'))
    this.load.image(imageRegistry.CARD_BACKGROUND, require('../../assets/img/card_background.png'))
    this.load.image(imageRegistry.CARD_BACKGROUND_DECOR, require('../../assets/img/card_background_decor.png'))
  }
}
