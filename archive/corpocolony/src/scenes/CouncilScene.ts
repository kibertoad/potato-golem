import { Scenes } from "../registries/SceneRegistry";
import {
  TextWithBackgroundBuilder,
  ButtonBuilder,
  ButtonListBuilder,
  ChangeSceneActivation,
  MultiplexActivation,
  UIContainer,
  UIGroupSlot,
} from "@potato-golem/ui";
import { Director, generateDirectors } from "../generators/directorGenerator";
import { buttonTemplate } from '../templates/UITemplates'
import { CouncilOverlay } from '../uiblocks/CouncilOverlay'
import { PotatoScene } from '@potato-golem/ui/dist/src/ui/common/PotatoScene'

export class CouncilScene extends PotatoScene {
  private vps: Director[];
  private vpContainers: UIContainer[];

  constructor() {
    super(Scenes.EXECUTIVE_COUNCIL);
    this.vpContainers = [];
  }

  init() {
    this.vps = generateDirectors(4);
  }

  create() {
    const { width, height } = this.scale;

    const councilOverlay = CouncilOverlay.build(this, { x: 0, y: 0 }, this.vps)

    /*
    const buttonList = new ButtonListBuilder(this)
      .template(buttonTemplate)
      .displaySize(150, 150)
      .setExactPosition(width * 0.2, height * 0.3)
      .setSpacingOffset(40, 0);

    for (let vp of this.vps) {
      const statsTableBuilder = new TextWithBackgroundBuilder(this);
      const { text } = statsTableBuilder
        .displaySize(150, 300)
        .textureKey("glass-panel")
        .text("Some text here")
        .build();

      const button = buttonList.addButton().textureKey(vp.icon).build();

      const optionContainer = new UIContainer(button);
      optionContainer.addSibling({
        sibling: text,
        offset: {
          x: 0,
          y: 0,
        },
      });
    }

    const endReviewButton = buttonList
      .addButton()
      .text("End review")
      .onClick(
        MultiplexActivation.build([
          ChangeSceneActivation.build(this, Scenes.OVERVIEW_SCENE),
        ])
      )
      .build();

     */
  }
}
