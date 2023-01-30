import { Scenes } from '../registries/SceneRegistry'
import { ButtonListBuilder, ButtonSquareBuilder, ChangeSceneActivation } from '@potato-golem/core'
import { technologies } from '../model/technologies'

export class OverviewScene extends Phaser.Scene {

  constructor() {
    super(Scenes.OVERVIEW_SCENE);
  }

  create() {
    const { width, height } = this.scale;
    const buttonList = new ButtonListBuilder(this)
      .textureKey("glass-panel")
      .displaySize(150, 50)
      .setExactPosition(width * 0.2, height * 0.6)
      .setSpacingOffset(10, 0)

    const researchButton = buttonList.addButton()
      .text("Research")
      //.onclick(new ChangeSceneActivation(this, Scenes.OVERVIEW_SCENE))
      .build();

    const technologiesButton = buttonList.addButton()
      .text("Technologies")
      //.onclick(new ChangeSceneActivation(this, Scenes.OVERVIEW_SCENE))
      .build();

    const mapButton = buttonList.addButton()
      .text("Map")
      //.onclick(new ChangeSceneActivation(this, Scenes.OVERVIEW_SCENE))
      .build();

    const endTurnButton = buttonList.addButton()
      .text("End turn")
      //.onclick(new ChangeSceneActivation(this, Scenes.OVERVIEW_SCENE))
      .build();

    const scienceSquare = new ButtonSquareBuilder(this)
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

  }

}