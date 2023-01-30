import { Scenes } from '../registries/SceneRegistry'
import { ButtonListBuilder, ChangeSceneActivation } from '@potato-golem/core'

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
  }

}