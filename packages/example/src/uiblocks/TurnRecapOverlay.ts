import { ActivationCallback, ButtonSquareBuilder, CommonUIGroup } from '@potato-golem/core'
import { TurnEvent } from '../processors/endTurnProcessor'
import { technologies } from '../model/technologies'
import { TechnologyBranchesList } from './TechnologyBranchesList'

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

    for (let event of turnEvents) {
      const activation: ActivationCallback = () => {
        //technologyGroupList.branchesList.populate(TechnologyBranchesList.build(scene, definition))
        //technologyGroupList.disable()
      }

      const newButton = turnRecapSquare.addButton()
        .text(event.name)
        .onclick(activation)
        .build()
    }

    return turnRecapOverlay
  }

}