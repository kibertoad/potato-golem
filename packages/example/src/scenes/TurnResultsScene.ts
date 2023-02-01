import { Scenes } from '../registries/SceneRegistry'
import { ButtonListBuilder, ChangeSceneActivation, MultiplexActivation, UIGroupSlot } from '@potato-golem/core'
import { TechnologyGroupList } from '../uiblocks/TechnologyGroupList'
import { MapOverlay } from '../uiblocks/MapOverlay'
import { EndTurnProcessor } from '../processors/endTurnProcessor'
import { TurnRecapOverlay } from '../uiblocks/TurnRecapOverlay'

export class TurnResultsScene extends Phaser.Scene {

  private eventsSquare: UIGroupSlot<TurnRecapOverlay> = new UIGroupSlot<TurnRecapOverlay>()
  private endTurnProcessor: EndTurnProcessor

  constructor() {
    super(Scenes.TURN_RESULTS);

    this.endTurnProcessor = new EndTurnProcessor()
  }

  init() {
    console.log(`let's init! ${Scenes.TURN_RESULTS}`)
    const turnEvents = this.endTurnProcessor.process()
    this.eventsSquare.populate(TurnRecapOverlay.build(this, turnEvents))
  }

  create() {
    const { width, height } = this.scale;
    const buttonList = new ButtonListBuilder(this)
      .textureKey("glass-panel")
      .displaySize(150, 50)
      .setExactPosition(width * 0.2, height * 0.6)
      .setSpacingOffset(10, 0)

    const endReviewButton = buttonList.addButton()
      .text("End review")
      .onClick(MultiplexActivation.build([
        ChangeSceneActivation.build(this, Scenes.OVERVIEW_SCENE)
      ]))
      .build();
  }

}