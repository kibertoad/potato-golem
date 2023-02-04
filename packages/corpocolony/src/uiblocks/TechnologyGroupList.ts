import {
  ActivationCallback,
  ButtonSquareBuilder,
  CommonUIGroup,
  SetTextActivation,
  UIGroupSlot,
} from '@potato-golem/extras'
import { technologies } from '../model/technologies'
import { TechnologyBranchesList } from './TechnologyBranchesList'

export class TechnologyGroupList extends CommonUIGroup{

  private branchesList?: UIGroupSlot<TechnologyBranchesList> = new UIGroupSlot()

  static build(scene: Phaser.Scene, descriptionBox: Phaser.GameObjects.Text) {
    const { width, height } = scene.scale;
    const technologyGroupList = new TechnologyGroupList()

    const scienceSquare = new ButtonSquareBuilder(scene)
      .rowSpacingOffset(10)
      .rowSize(3)
      .textureKey("glass-panel")
      .displaySize(175, 175)
      .setExactPosition(width * 0.1, height * 0.2)
      .setSpacingOffset(10, 0)

    for (let technology of Object.entries(technologies)) {
      const [techId, definition] = technology
      const activation: ActivationCallback = () => {
        technologyGroupList.branchesList.populate(TechnologyBranchesList.build(scene, definition, descriptionBox))
        technologyGroupList.disable()
      }

      const newButton = scienceSquare.addButton()
        .text('')
        .onUnhover(SetTextActivation.build(descriptionBox, ''))
        .onHover(SetTextActivation.build(descriptionBox, `
        ${definition.name}
        ${definition.description ?? ''}
        `))
        .textureKey(definition.icon ?? 'glass-panel')
        .onClick(activation)
        .build()
    }

    technologyGroupList.addChildren(scienceSquare.build())
    return technologyGroupList
  }

  destroy() {
    this.branchesList.destroy()
    super.destroy();
  }
}