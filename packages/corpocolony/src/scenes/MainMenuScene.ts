import { Scenes } from "../registries/SceneRegistry";
import {
  BackgroundBuilder, buildDialog,
  ButtonListBuilder, ButtonListBuilder1,
  ChangeSceneActivation,
  MultiplexActivation, TextBuilder,
} from '@potato-golem/ui'
import { SetWorldActivation } from "../activations/SetWorldActivation";
import { worldState } from "../model/worldState";

const cursorHandImg = require("../../assets/img/cursor_hand.png");
const glassPanelImg = require("../../assets/img/glassPanel.png");
const violetImg = require("../../assets/img/violet.png");
const soldierImg = require("../../assets/img/soldier.png");
const artilleryImg = require("../../assets/img/artillery.png");
const tanksImg = require("../../assets/img/tanks.png");
const antiAirImg = require("../../assets/img/antiair.png");
const dronesImg = require("../../assets/img/drones.png");
const communicationsImg = require("../../assets/img/communications.png");
import BaseSound = Phaser.Sound.BaseSound;

import { TextBox, RoundRectangle } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { PotatoScene } from '@potato-golem/ui/dist/src/ui/common/PotatoScene'

export class MainMenuScene extends PotatoScene {
  private buttons: Phaser.GameObjects.Image[] = [];
  private selectedButtonIndex = 0;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private mainTheme: BaseSound;

  constructor() {
    super(Scenes.MAIN_MENU_SCENE);
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    this.load.image("glass-panel", glassPanelImg);
    this.load.image("cursor-hand", cursorHandImg);
    this.load.image("violet", violetImg);
    this.load.image(
      "violet-border",
      require("../../assets/img/violet-border.png")
    );
    this.load.image(
      "violet-border2",
      require("../../assets/img/violet-border2.png")
    );
    this.load.image("soldier", soldierImg);
    this.load.image("drones", dronesImg);
    this.load.image("antiAir", antiAirImg);
    this.load.image("tanks", tanksImg);
    this.load.image("artillery", artilleryImg);
    this.load.image("communications", communicationsImg);

    this.load.image(
      "male1",
      require("../../assets/img/directors/male/male1.png")
    );
    this.load.image(
      "male2",
      require("../../assets/img/directors/male/male2.png")
    );
    this.load.image(
      "male3",
      require("../../assets/img/directors/male/male3.png")
    );
    this.load.image(
      "male4",
      require("../../assets/img/directors/male/male4.png")
    );
    this.load.image(
      "male5",
      require("../../assets/img/directors/male/male5.png")
    );
    this.load.image(
      "male6",
      require("../../assets/img/directors/male/male6.png")
    );
    this.load.image(
      "male7",
      require("../../assets/img/directors/male/male7.png")
    );
    this.load.image(
      "male8",
      require("../../assets/img/directors/male/male8.png")
    );
    this.load.image(
      "male9",
      require("../../assets/img/directors/male/male9.png")
    );
    this.load.image(
      "male10",
      require("../../assets/img/directors/male/male10.png")
    );
    this.load.image(
      "male11",
      require("../../assets/img/directors/male/male11.png")
    );
    this.load.image(
      "male12",
      require("../../assets/img/directors/male/male12.png")
    );
    this.load.image(
      "male13",
      require("../../assets/img/directors/male/male13.png")
    );
    this.load.image(
      "male14",
      require("../../assets/img/directors/male/male14.png")
    );
    this.load.image(
      "male15",
      require("../../assets/img/directors/male/male15.png")
    );
    this.load.image(
      "male16",
      require("../../assets/img/directors/male/male16.png")
    );
    this.load.image(
      "male17",
      require("../../assets/img/directors/male/male17.png")
    );
    this.load.image(
      "male18",
      require("../../assets/img/directors/male/male18.png")
    );
    this.load.image(
      "male19",
      require("../../assets/img/directors/male/male19.png")
    );
    this.load.image(
      "male20",
      require("../../assets/img/directors/male/male20.png")
    );

    this.load.image(
      "female1",
      require("../../assets/img/directors/female/female1.png")
    );
    this.load.image(
      "female2",
      require("../../assets/img/directors/female/female2.png")
    );
    this.load.image(
      "female3",
      require("../../assets/img/directors/female/female3.png")
    );
    this.load.image(
      "female4",
      require("../../assets/img/directors/female/female4.png")
    );
    this.load.image(
      "female5",
      require("../../assets/img/directors/female/female5.png")
    );
    this.load.image(
      "female6",
      require("../../assets/img/directors/female/female6.png")
    );
    this.load.image(
      "female7",
      require("../../assets/img/directors/female/female7.png")
    );
    this.load.image(
      "female8",
      require("../../assets/img/directors/female/female8.png")
    );
    this.load.image(
      "female9",
      require("../../assets/img/directors/female/female9.png")
    );
    this.load.image(
      "female10",
      require("../../assets/img/directors/female/female10.png")
    );
    this.load.image(
      "female11",
      require("../../assets/img/directors/female/female11.png")
    );
    this.load.image(
      "female12",
      require("../../assets/img/directors/female/female12.png")
    );
    this.load.image(
      "female13",
      require("../../assets/img/directors/female/female13.png")
    );
    this.load.image(
      "female14",
      require("../../assets/img/directors/female/female14.png")
    );
    this.load.image(
      "female15",
      require("../../assets/img/directors/female/female15.png")
    );
    this.load.image(
      "female16",
      require("../../assets/img/directors/female/female16.png")
    );
    this.load.image(
      "female17",
      require("../../assets/img/directors/female/female17.png")
    );

    this.load.audio(
      "mainTheme",
      require("url:../../assets/music/roots_of_peace_01.ogg")
    );
  }

  create() {
    /*
    this.mainTheme = this.sound.add("mainTheme");
    this.mainTheme.play({
      loop: true,
    });

     */

    const { width, height } = this.scale;


    const title = new BackgroundBuilder(this)
      .textureKey('violet')
      .text('Colony Incorporated: \nSurvival is a vibe')
      .displaySize(250, 50)
      .position(width * 0.3, height * 0.4)
      .build()




    const subTitle = new TextBuilder(this)
      .text('The fate of humanity is in the hands of the industry veterans with dental plan and stock options.')
      .displaySize(250, 150)
      .position(width * 0.3, height * 0.6)
      .build()


/*
    const dialog = buildDialog(this, {
      x: 200,
      y: 200,
      backgroundHeight: 200,
      backgroundWidth: 200,
      promptText: 'Shall we?',
      actionOptions: [
        {
          text: 'Yes',
          activation: () => {
            console.log('yes')
          }
        },
        {
          text: 'No',
          activation: () => {
            console.log('no')
          }
        }
      ],
      choiceOptions: [
        {
          text: 'Yes',
          activation: () => {
            console.log('yes')
          }
        },
        {
          text: 'No',
          activation: () => {
            console.log('no')
          }
        }
      ]
    })

 */


    const buttonList = new ButtonListBuilder1(this)
      .textureKey("violet")
      .displaySize(150, 50)
      .setExactPosition(width * 0.5, height * 0.6)
      .setSpacingOffset(0, 10);

    const playButton = buttonList
      .addButton()
      .text("Play")
      .onClick(
        MultiplexActivation.build([
          SetWorldActivation.build(worldState),
          ChangeSceneActivation.build(this, Scenes.OVERVIEW_SCENE),
        ])
      )
      .build();

    const settingsButton = buttonList
      .addButton()
      .text("Settings")
      .onClick(ChangeSceneActivation.build(this, Scenes.HIRE_DIRECTOR))
      .build();

    // Credits button
    const creditsButton = buttonList
      .addButton()
      .text("Credits")
      .onClick(() => {
        console.log("clickety click ");
      })
      .build();

    this.buttons.push(playButton);
    this.buttons.push(settingsButton);
    this.buttons.push(creditsButton);

    playButton.on("selected", () => {
      console.log("play");
    });

    settingsButton.on("selected", () => {
      console.log("settings");
    });

    creditsButton.on("selected", () => {
      console.log("credits");
    });



    /*
    const r1 = this.add.graphics();

    // draw rectangle
    r1.fillStyle(0xffb000, 1);
    r1.fillRect(450, 200, 200, 200);

    // this line seem to cause the problem somehow
    r1.setInteractive(
      new Phaser.Geom.Rectangle(450, 200, 200, 200),
      Phaser.Geom.Rectangle.Contains
    );

    // pointer on rectangle
    r1.on(Phaser.Input.Events.POINTER_OVER, function () {
      r1.alpha = 0.5;
    });
    r1.on(Phaser.Input.Events.POINTER_OUT, function () {
      r1.alpha = 1.0;
    });
    r1.on(Phaser.Input.Events.POINTER_DOWN, function () {
      console.log("clickety clackety");
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      playButton.off("selected");
      // ...
    });

     */
  }

  confirmSelection() {
    // get the currently selected button
    const button = this.buttons[this.selectedButtonIndex];

    // emit the 'selected' event
    button.emit("selected");
  }

  update() {
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up!);
    const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down!);
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(
      this.cursors.space!
    );

    if (spaceJustPressed) {
      this.confirmSelection();
    }
  }
}
