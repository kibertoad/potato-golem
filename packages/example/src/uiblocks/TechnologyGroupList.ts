import { ButtonListBuilder, ButtonSquareBuilder, ChangeSceneActivation } from '@potato-golem/core'
import { technologies } from '../model/technologies'

export class TechnologyGroupList {

  static build(scene: Phaser.Scene) {
    const { width, height } = scene.scale;

    const scienceSquare = new ButtonSquareBuilder(scene)
      .rowSpacingOffset(10)
      .rowSize(3)
      .textureKey("glass-panel")
      .displaySize(200, 50)
      .setExactPosition(width * 0.1, height * 0.2)
      .setSpacingOffset(10, 0)

    for (let technology of Object.entries(technologies)) {
      const [techId, definition] = technology

      scienceSquare.addButton()
        .text(definition.name)
        .build()
    }

    return scienceSquare
  }

}