import {
  TextWithBackgroundBuilder,
  ButtonListBuilder1,
  ChangeSceneActivation,
  MultiplexActivation, PotatoScene,
  TextBuilder,
} from '@potato-golem/ui'
import { Scenes } from '../../model/registries/SceneRegistry'

const cursorHandImg = require('../../../assets/img/cursor_hand.png')
const glassPanelImg = require('../../../assets/img/glassPanel.png')
const violetImg = require('../../../assets/img/violet.png')
const logoImg = require('../../../assets/img/logo.png')
import BaseSound = Phaser.Sound.BaseSound

import { UiImages } from '../../model/registries/ImageRegistry'

const isSoundEnabled = false

export class MainMenuScene extends PotatoScene {
  private buttons: Phaser.GameObjects.Image[] = []
  private selectedButtonIndex = 0
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  private mainTheme: BaseSound

  constructor() {
    super(Scenes.MAIN_MENU_SCENE)
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  preload() {
    this.load.image(UiImages.neonWindow9Patch, require('../../../assets/img/neon-window-9patch.png'))
    this.load.image(UiImages.roseWindow9Patch, require('../../../assets/img/rose-window-9patch.png'))

    this.load.image('glass-panel', glassPanelImg)
    this.load.image('cursor-hand', cursorHandImg)
    this.load.image('logo', logoImg)
    this.load.image('violet', violetImg)
    this.load.image('violet-border', require('../../../assets/img/violet-border.png'))
    this.load.image('violet-border2', require('../../../assets/img/violet-border2.png'))

    // todo restore music
    // this.load.audio('mainTheme', require('url:../../../assets/music/roots_of_peace_01.ogg'))
  }

  create() {
    if (isSoundEnabled) {
      this.mainTheme = this.sound.add('mainTheme')
      this.mainTheme.play({
        loop: true,
      })
    }

    const { width, height } = this.scale

    const title = new TextWithBackgroundBuilder(this)
      .textureKey('glass-panel')
      .text('There Are Deadlines In Hell')
      .displaySize(250, 50)
      .position(width * 0.3, height * 0.4)
      .build()

    const subTitle = new TextBuilder(this)
      .setText('Move fast and break down')
      .setDisplaySize(250, 150)
      .setPosition({ x: width * 0.3, y: height * 0.6})
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
      .textureKey('violet')
      .displaySize(150, 50)
      .setExactPosition(width * 0.5, height * 0.6)
      .setSpacingOffset(0, 10)

    const playButton = buttonList
      .addButton()
      .text('Play')
      .onClick(
        MultiplexActivation.build([
          // SetWorldActivation.build(worldState),
          ChangeSceneActivation.build(this, Scenes.BOARD_SCENE),
        ]),
      )
      .build()

    const settingsButton = buttonList
      .addButton()
      .text('Settings')
      //.onClick(ChangeSceneActivation.build(this, Scenes.HIRE_DIRECTOR))
      .build()

    // Credits button
    const creditsButton = buttonList
      .addButton()
      .text('Credits')
      //.onClick(ChangeSceneActivation.build(this, Scenes.EXECUTIVE_COUNCIL))
      .build()

    this.buttons.push(playButton)
    this.buttons.push(settingsButton)
    this.buttons.push(creditsButton)

    playButton.on('selected', () => {
      console.log('play')
    })

    settingsButton.on('selected', () => {
      console.log('settings')
    })

    creditsButton.on('selected', () => {
      console.log('credits')
    })

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
    const button = this.buttons[this.selectedButtonIndex]

    // emit the 'selected' event
    button.emit('selected')
  }

  update() {
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
    const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space!)

    if (spaceJustPressed) {
      this.confirmSelection()
    }
  }
}
