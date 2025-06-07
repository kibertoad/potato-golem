import { PrefabMainMenuScene } from '@potato-golem/prefab-scenes'
import { imageRegistry } from '../registries/imageRegistry'
import { type SceneId, sceneRegistry } from '../registries/sceneRegistry'
import { populateStartGame } from '../model/populators/StartGamePopulator'
import { worldModel } from '../model/entities/WorldModel'

const isMusicEnabled = false

export class MainMenuScene extends PrefabMainMenuScene<SceneId> {
  constructor() {
    super({
      buttonTextureKey: imageRegistry.ROCKET,
      credits: [],
      gameStartScene: sceneRegistry.BOARD_SCENE,
      mainMenuSceneId: sceneRegistry.MAIN_MENU_SCENE,
      subtitleText: 'Clockwork Home',
      worldModelPopulator: () => {
        populateStartGame(worldModel)
      }
    })
  }

  preloadImages(): void {
    this.load.image(imageRegistry.ROCKET, require('../../assets/img/favicon.png'))
    this.load.image(imageRegistry.CARD_BACKGROUND, require('../../assets/img/card_background.png'))
    this.load.image(imageRegistry.CARD_BACKGROUND_DECOR, require('../../assets/img/card_background_decor.png'))
  }
}
