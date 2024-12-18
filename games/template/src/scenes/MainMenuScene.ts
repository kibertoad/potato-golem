import {
  ChangeSceneActivation,
  PotatoScene,
  TextBuilder,
} from '@potato-golem/ui'
import Phaser from 'phaser'

import { imageRegistry } from '../registries/imageRegistry'
import { sceneRegistry } from '../registries/sceneRegistry'
import { musicRegistry } from '../registries/musicRegistry'
import { ButtonListBuilder } from '../builders/ButtonListBuilder'

const isMusicEnabled = false

export class MainMenuScene extends PotatoScene {
  private buttons: Phaser.GameObjects.Image[] = []
  private selectedButtonIndex = 0
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private mainTheme:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound

  constructor() {
    super(sceneRegistry.MAIN_MENU_SCENE)
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  preload() {
    this.load.image(imageRegistry.ROCKET, require('../../assets/img/favicon.png'))

    if (isMusicEnabled) {
      this.load.audio(
        musicRegistry.MAIN_THEME,
        require("url:../../assets/music/bg_draft.mp3")
      );
    }
  }

  create() {
    if (isMusicEnabled) {
      this.mainTheme = this.sound.add(musicRegistry.MAIN_THEME)
      this.mainTheme.play({
        loop: true,
      })
    }

    const { width, height } = this.scale

    const subTitle = new TextBuilder(this)
      .setText('Discount Store Alchemist')
      .setDisplaySize(250, 150)
      .setPosition({ x: width * 0.3, y: height * 0.6 })
      .build()

    const buttonList = new ButtonListBuilder(this)
      .textureKey(imageRegistry.ROCKET)
      .displaySize(150, 50)
      .setExactPosition(width * 0.5, height * 0.6)
      .setSpacingOffset(0, 10)

    const playButton = buttonList
      .addButton()
      .text('Play')
      .onClick(ChangeSceneActivation.build(this, sceneRegistry.BOARD_SCENE))
      .build()

    const settingsButton = buttonList.addButton().text('Settings').build()

    // Credits button
    const creditsButton = buttonList.addButton().text('Credits').build()

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
