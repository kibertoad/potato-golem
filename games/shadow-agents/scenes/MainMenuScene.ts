import {
  ButtonListBuilder1,
  ChangeSceneActivation,
  MultiplexActivation, PotatoScene,
  TextBuilder,
} from '@potato-golem/ui'

import BaseSound = Phaser.Sound.BaseSound
import { Scenes } from './SceneRegistry'

export class MainMenuScene extends PotatoScene {
  private buttons: Phaser.GameObjects.Image[] = []
  private selectedButtonIndex = 0
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super(Scenes.MAIN_MENU_SCENE)
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  preload() {
    this.load.image('favicon', require('../assets/img/favicon.png'))
  }

  create() {
    const { width, height } = this.scale

    const subTitle = new TextBuilder(this)
      .setText('Shadow Agents')
      .setDisplaySize(250, 150)
      .setPosition({ x: width * 0.3, y: height * 0.6})
      .build()

    const buttonList = new ButtonListBuilder1(this)
      .textureKey('favicon')
      .displaySize(150, 50)
      .setExactPosition(width * 0.5, height * 0.6)
      .setSpacingOffset(0, 10)

    const playButton = buttonList
      .addButton()
      .text('Play')
      .onClick(
          ChangeSceneActivation.build(this, Scenes.MAIN_MENU_SCENE),
      )
      .build()

    const settingsButton = buttonList
      .addButton()
      .text('Settings')
      .build()

    // Credits button
    const creditsButton = buttonList
      .addButton()
      .text('Credits')
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
