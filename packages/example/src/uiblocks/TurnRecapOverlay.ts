import { ActivationCallback, ButtonBuilder, ButtonSquareBuilder, CommonUIGroup } from '@potato-golem/extras'
import { TurnEvent } from '../processors/endTurnProcessor'

export class TurnRecapOverlay extends CommonUIGroup{

  static build(scene: Phaser.Scene, turnEvents: TurnEvent[]) {
    const { width, height } = scene.scale;
    const turnRecapOverlay = new TurnRecapOverlay()

    const turnRecapSquare = new ButtonSquareBuilder(scene)
      .rowSpacingOffset(10)
      .rowSize(3)
      .textureKey("glass-panel")
      .displaySize(200, 50)
      .setExactPosition(width * 0.1, height * 0.2)
      .setSpacingOffset(10, 0)

    new ButtonBuilder(scene)
      .textureKey("soldier")
      .displaySize(200, 200)
      .text('')
      .position(width * 0.7, height * 0.4)
      .build()

    for (let event of turnEvents) {
      const activation: ActivationCallback = () => {
        //technologyGroupList.branchesList.populate(TechnologyBranchesList.build(scene, definition))
        //technologyGroupList.disable()
      }

      const newButton = turnRecapSquare.addButton()
        .text(event.name)
        .onClick(activation)
        .build()
    }

    return turnRecapOverlay
  }

}