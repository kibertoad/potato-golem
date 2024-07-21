import {
  ButtonListBuilder1,
  ChangeSceneActivation,
  PotatoScene,
  TextBuilder,
} from '@potato-golem/ui'
import Phaser from 'phaser'

import { ImageRegistry } from '../model/registries/imageRegistry'
import { MusicRegistry } from '../model/registries/musicRegistry'
import { Scenes } from './SceneRegistry'

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
    super(Scenes.MAIN_MENU_SCENE)
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  preload() {
    this.load.image(ImageRegistry.ROCKET, require('../../assets/img/favicon.png'))
    this.load.image(ImageRegistry.BOARD_BACKGROUND, require('../../assets/img/homun_bkgd1.png'))
    this.load.image(ImageRegistry.HEALTH_CARD, require('../../assets/img/card_image.png'))
    this.load.image(ImageRegistry.CARD_FRAME, require('../../assets/img/card_background.png'))

    if (isMusicEnabled) {
      /*
      this.load.audio(
        MusicRegistry.MAIN_THEME,
        require("url:../../assets/music/bg_draft.mp3")
      );
       */
    }
  }

  create() {
    if (isMusicEnabled) {
      this.mainTheme = this.sound.add(MusicRegistry.MAIN_THEME)
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

    const buttonList = new ButtonListBuilder1(this)
      .textureKey(ImageRegistry.ROCKET)
      .displaySize(300, 50)
      .setExactPosition(width / 2 , height / 2)
      .setSpacingOffset(0, 50)

    this.centerButtonList(buttonList, 3, 50)

    const playButton = buttonList
      .addButton()
      .text('Play')
      .onClick(ChangeSceneActivation.build(this, Scenes.BOARD_SCENE))
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

  centerButtonList(buttonList: ButtonListBuilder1, buttonCount: number, spacingOffsetY: number = 0) {
    buttonList.setExactPosition(
      this.scale.width / 2, 
      this.scale.height / 2 - (
        (buttonCount * (buttonList.displaySizeY) + (buttonCount - 1) * spacingOffsetY) / 2
      )
    )
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
