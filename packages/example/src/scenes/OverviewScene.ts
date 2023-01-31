import { Scenes } from '../registries/SceneRegistry'
import { ButtonListBuilder, UIGroupSlot } from '@potato-golem/core'
import { TechnologyGroupList } from '../uiblocks/TechnologyGroupList'
import { MapOverlay } from '../uiblocks/MapOverlay'
import { EndTurnProcessor } from '../processors/endTurnProcessor'

export class OverviewScene extends Phaser.Scene {

  private scienceSquare: UIGroupSlot<TechnologyGroupList> = new UIGroupSlot<TechnologyGroupList>()

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
      .onclick(() => {
        this.scienceSquare.populate(TechnologyGroupList.build(this))
      })
      .build();

    const technologiesButton = buttonList.addButton()
      .text("Technologies")
      .onclick(() => {
        this.scienceSquare.populate(TechnologyGroupList.build(this))
      })
      .build();

    const mapButton = buttonList.addButton()
      .text("Map")
      //.onclick(new ChangeSceneActivation(this, Scenes.OVERVIEW_SCENE))
      .build();

    const endTurnButton = buttonList.addButton()
      .text("End turn")
      .onclick(EndTurnProcessor.build())
      .build();

    //const scienceSquare = TechnologyGroupList.build(this)
    //const branchesSquare = TechnologyBranchesList.build(this)

    const map = MapOverlay.build(this, {
      x: 300,
      y: 300,
    })
  }

}