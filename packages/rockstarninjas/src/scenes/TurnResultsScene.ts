import { Scenes } from "../registries/SceneRegistry";
import {
  GridButtonBuilder,
  UIGroupSlot,
} from '@potato-golem/ui'
import { EndTurnProcessor } from "../processors/endTurnProcessor";
import { TurnRecapOverlay } from "../uiblocks/TurnRecapOverlay";
import { PotatoScene } from '@potato-golem/ui/dist/src/ui/common/PotatoScene'

export class TurnResultsScene extends PotatoScene {
  private eventsSquare: UIGroupSlot<TurnRecapOverlay> =
    new UIGroupSlot<TurnRecapOverlay>();
  private endTurnProcessor: EndTurnProcessor;

  constructor() {
    super(Scenes.TURN_RESULTS);

    this.endTurnProcessor = new EndTurnProcessor();
  }

  init() {
    console.log(`let's init! ${Scenes.TURN_RESULTS}`);
    const turnEvents = this.endTurnProcessor.process();
    this.eventsSquare.populate(TurnRecapOverlay.build(this, turnEvents));
  }

  create() {
    const { width, height } = this.scale;

    const gridBuilder = new GridButtonBuilder(this)
      .setPosition({
        x: 200,
        y: 300,
      })
      .setWidth(100)
      .setHeight(100)
      .setHeaderText('Turn results')
      .setChoiceRowLength(3)
      .addAction({
        text: 'OK',
      })
      .addChoice({
        text: '111',
      })
      .addChoice({
        text: '222',
      })
      .addChoice({
        text: '333',
      })
      .addChoice({
        text: '444',
      })

    gridBuilder.build()

    /*
    const buttonList = new ButtonListBuilder(this)
      .textureKey("glass-panel")
      .displaySize(150, 50)
      .setExactPosition(width * 0.2, height * 0.6)
      .setSpacingOffset(10, 0);



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
