import {
  ButtonListBuilder,
  ButtonSquareBuilder,
  ChangeSceneActivation,
  CommonUIGroup,
  SetTextActivation,
  UIContainer,
} from "@potato-golem/ui";
import {
  ParentTechnologyDefinition,
  technologies,
} from "../model/technologies";

export class TechnologyBranchesList extends CommonUIGroup {
  static build(
    scene: Phaser.Scene,
    technologyGroup: ParentTechnologyDefinition,
    descriptionBox: UIContainer<Phaser.GameObjects.Text>
  ) {
    const { width, height } = scene.scale;
    const technologyBranchesList = new TechnologyBranchesList();

    const scienceBranchSquare = new ButtonSquareBuilder(scene)
      .rowSpacingOffset(10)
      .rowSize(2)
      .textureKey("glass-panel")
      .displaySize(200, 50)
      .setExactPosition(width * 0.1, height * 0.2)
      .setSpacingOffset(10, 0);

    for (let branch of Object.entries(technologyGroup.branches)) {
      const [branchId, definition] = branch;

      scienceBranchSquare
        .addButton()
        .text(definition.name)
        .onUnhover(SetTextActivation.build(descriptionBox, ""))
        .onHover(
          SetTextActivation.build(descriptionBox, definition.description)
        )
        .build();
    }

    technologyBranchesList.addChildren(scienceBranchSquare.build());
    return technologyBranchesList;
  }
}
