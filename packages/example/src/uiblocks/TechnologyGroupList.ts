import { ActivationCallback, ButtonSquareBuilder, CommonUIGroup, UIGroupSlot } from '@potato-golem/core'
import { technologies } from '../model/technologies'
import { TechnologyBranchesList } from './TechnologyBranchesList'

export class TechnologyGroupList extends CommonUIGroup{

  private branchesList?: UIGroupSlot<TechnologyBranchesList> = new UIGroupSlot()

  static build(scene: Phaser.Scene) {
    const { width, height } = scene.scale;
    const technologyGroupList = new TechnologyGroupList()

    const scienceSquare = new ButtonSquareBuilder(scene)
      .rowSpacingOffset(10)
      .rowSize(3)
      .textureKey("glass-panel")
      .displaySize(200, 50)
      .setExactPosition(width * 0.1, height * 0.2)
      .setSpacingOffset(10, 0)

    for (let technology of Object.entries(technologies)) {
      const [techId, definition] = technology
      const activation: ActivationCallback = () => {
        technologyGroupList.branchesList.populate(TechnologyBranchesList.build(scene, definition))
        technologyGroupList.disable()
      }

      const newButton = scienceSquare.addButton()
        .text(definition.name)
        .onclick(activation)
        .build()

    }

    technologyGroupList.addChildren(scienceSquare.build())
    return technologyGroupList
  }

}