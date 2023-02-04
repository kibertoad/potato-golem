import { Scenes } from '../registries/SceneRegistry'
import {
  BackgroundBuilder,
  ButtonListBuilder,
  ChangeSceneActivation,
  MultiplexActivation,
  SetTextActivation,
  UIGroupSlot,
} from '@potato-golem/ui'
import { TechnologyGroupList } from '../uiblocks/TechnologyGroupList'
import { MapOverlay } from '../uiblocks/MapOverlay'
import { buttonTemplate } from '../templates/UITemplates'
import { PotatoScene } from '@potato-golem/ui/dist/src/ui/common/PotatoScene'
import { COLOR_DARK, COLOR_LIGHT, SOMECOLOR } from '@potato-golem/ui/dist/src/ui/constants/Colours'

export class OverviewScene extends PotatoScene {
  private scienceSquare: UIGroupSlot<TechnologyGroupList> =
    new UIGroupSlot<TechnologyGroupList>()
  private mapOverlay: UIGroupSlot<MapOverlay> = new UIGroupSlot()

  constructor() {
    super(Scenes.OVERVIEW_SCENE)
  }

  create() {
    const { width, height } = this.scale

    const { text: infoBackgroundText } = new BackgroundBuilder(this)
      .position(0.8 * width, 0.45 * height)
      .textureKey('violet-border2')
      .displaySize(0.3 * width, 0.75 * height)
      .build()

    const buttonList = new ButtonListBuilder(this)
      .setExactPosition(width * 0.2, height * 0.9)
      .setSpacingOffset(10, 0)
      .addButton({
        text: 'Research',
        activation: () => {
          this.mapOverlay.destroy()
          this.scienceSquare.populate(
            TechnologyGroupList.build(this, infoBackgroundText),
          )
        },
      })
      .fillColour(COLOR_LIGHT)
      .highlightFillColour(COLOR_DARK)
      .addButton({
        text: 'Map',
        activation: () => {
          this.scienceSquare.destroy()
          this.mapOverlay.populate(
            MapOverlay.build(this, {
              x: 300,
              y: 300,
            }),
          )
        },
      })
      .addButton({
        text: 'End turn',
        activation: MultiplexActivation.build([
          ChangeSceneActivation.build(this, Scenes.TURN_RESULTS),
        ]),
      })
      .build()

    /*
    const buttonList = new ButtonListBuilder(this)
      .template(buttonTemplate)
      .setExactPosition(width * 0.2, height * 0.9)
      .setSpacingOffset(10, 0);

    const researchButton = buttonList
      .addButton()
      .text("Research")
      .onClick(() => {
        this.mapOverlay.destroy();
        this.scienceSquare.populate(
          TechnologyGroupList.build(this, infoBackgroundText)
        );
      })
      .onHover(
        SetTextActivation.build(
          infoBackgroundText,
          "Test on hover Test on hover Some other words Test on hover Test on and cut it off hover Test on hover Test then there on hover Test on aa alpha hover gamma Test on hover Test on hover Test on hover Test on hover Test on hover Test on hover"
        )
      )
      .onUnhover(SetTextActivation.build(infoBackgroundText, ""))
      .build();

    const technologiesButton = buttonList
      .addButton()
      .text("Technologies")
      .onClick(() => {
        this.mapOverlay.destroy();
        this.scienceSquare.populate(
          TechnologyGroupList.build(this, infoBackgroundText)
        );
      })
      .build();

    const mapButton = buttonList
      .addButton()
      .text("Map")
      .onClick(() => {
        this.scienceSquare.destroy();
        this.mapOverlay.populate(
          MapOverlay.build(this, {
            x: 300,
            y: 300,
          })
        );
      })
      .build();

    const endTurnButton = buttonList
      .addButton()
      .text("End turn")
      .onClick(
        MultiplexActivation.build([
          ChangeSceneActivation.build(this, Scenes.TURN_RESULTS),
        ])
      )
      .build();

     */
  }
}
