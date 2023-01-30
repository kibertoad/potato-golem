import { ButtonListBuilder, ChangeSceneActivation } from '@potato-golem/core'
import { technologies } from '../model/technologies'

export class TechnologyGroupList {

  static build(scene: Phaser.Scene) {
    const { width, height } = scene.scale;
    const row1 = new ButtonListBuilder(scene)
      .textureKey("glass-panel")
      .displaySize(150, 50)
      .setExactPosition(width * 0.2, height * 0.6)
      .setSpacingOffset(10, 0)

    for (let technology of Object.entries(technologies)) {
      const [techId, definition] = technology



    }


  }

}