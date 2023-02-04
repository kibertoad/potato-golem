import { Scenes } from "../registries/SceneRegistry";
import {
  BackgroundBuilder,
  ButtonBuilder,
  ButtonListBuilder,
  ChangeSceneActivation,
  MultiplexActivation,
  UIContainer,
  UIGroupSlot,
} from "@potato-golem/ui";
import { Director, generateDirectors } from "../generators/directorGenerator";

export class HireDirectorScene extends Phaser.Scene {
  private directors: Director[];
  private directorContainers: UIContainer[];

  constructor() {
    super(Scenes.HIRE_DIRECTOR);
    this.directorContainers = [];
  }

  init() {
    console.log(`let's hire a director! ${Scenes.HIRE_DIRECTOR}`);
    this.directors = generateDirectors(3);
    console.log(JSON.stringify(this.directors));
  }

  create() {
    const { width, height } = this.scale;
    const buttonList = new ButtonListBuilder(this)
      .textureKey("glass-panel")
      .displaySize(150, 150)
      .setExactPosition(width * 0.2, height * 0.3)
      .setSpacingOffset(40, 0);

    for (let director of this.directors) {
      const statsTableBuilder = new BackgroundBuilder(this);
      const { text } = statsTableBuilder
        .displaySize(150, 300)
        .textureKey("glass-panel")
        .text("Some text here")
        .build();

      const button = buttonList.addButton().textureKey(director.icon).build();

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
  }
}
