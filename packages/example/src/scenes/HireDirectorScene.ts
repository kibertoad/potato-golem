import { Scenes } from '../registries/SceneRegistry'
import { ButtonListBuilder, ChangeSceneActivation, MultiplexActivation, UIGroupSlot } from '@potato-golem/core'
import { TechnologyGroupList } from '../uiblocks/TechnologyGroupList'
import { MapOverlay } from '../uiblocks/MapOverlay'
import { EndTurnProcessor } from '../processors/endTurnProcessor'
import { TurnRecapOverlay } from '../uiblocks/TurnRecapOverlay'
import { Director, generateDirectors } from '../generators/directorGenerator'

export class HireDirectorScene extends Phaser.Scene {

  private directors: Director[]

  constructor() {
    super(Scenes.HIRE_DIRECTOR);
  }

  init() {
    console.log(`let's hire a director! ${Scenes.HIRE_DIRECTOR}`)
    this.directors = generateDirectors(3)
    console.log(JSON.stringify(this.directors))
  }

  create() {
    const { width, height } = this.scale;
    const buttonList = new ButtonListBuilder(this)
      .textureKey("glass-panel")
      .displaySize(150, 150)
      .setExactPosition(width * 0.2, height * 0.6)
      .setSpacingOffset(10, 0)

    for (let director of this.directors) {
      buttonList.addButton()
        .textureKey(director.icon)
        .build()
    }


    const endReviewButton = buttonList.addButton()
      .text("End review")
      .onClick(MultiplexActivation.build([
        ChangeSceneActivation.build(this, Scenes.OVERVIEW_SCENE)
      ]))
      .build();
  }

}