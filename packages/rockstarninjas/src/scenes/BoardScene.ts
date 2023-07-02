import { PotatoScene } from '@potato-golem/ui/dist/src/ui/common/PotatoScene'
import { Scenes } from '../registries/SceneRegistry'
import { buildDrag } from '@potato-golem/ui'

export class BoardScene extends PotatoScene {

  constructor() {
    super(Scenes.BOARD_SCENE);
  }

  init() {
    const engineer = this.rexUI.add.roundRectangle(200, 200, 2, 2, 20)
      .setFillStyle(0xa98270, 120)
      .setStrokeStyle(2, 0xa98274)
    
    buildDrag(engineer)
  }

  preload() {

  }

  create() {

  }

}
