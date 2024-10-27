import { ButtonListBuilder, ChangeSceneActivation, PotatoScene, TextBuilder, type UIContainer } from '@potato-golem/ui'
import Phaser from 'phaser'

import Container = Phaser.GameObjects.Container

export type CreditsEntry = {
  position: string,
  names: string[]
}

export type MainMenuParams = {
  mainMenuSceneId: string
  credits: CreditsEntry[]
  buttonTextureKey: string
  subtitleText: string
  gameStartScene: Phaser.Scene
}

export abstract class PrefabMainMenuScene extends PotatoScene {
  private readonly params: MainMenuParams

  private buttons: Container[] = []
  private selectedButtonIndex = 0
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private subTitle!: UIContainer<Phaser.GameObjects.Text>

  constructor(params: MainMenuParams) {
    super(params.mainMenuSceneId)
    this.params = params
  }

  init() {}

  abstract preloadImages(): void

  preload() {
    this.preloadImages()
  }

  create() {
    const { width } = this.scale

    this.subTitle = new TextBuilder(this)
      .setText(this.params.subtitleText)
      .setDisplaySize(1000, 150)
      .setPosition({
        x: width / 2,
        y: 350,
      })
      .build()
    this.subTitle.value.setFontSize(50)

    const buttonList = new ButtonListBuilder(this, {
      depth: 100,
      distance: 20,
      height: 50,
      width: 300,
      orientation: 'vertical',
      hoverTint: 0x66ff7f,
      position: {
        x: width / 2 - 300 / 2,
        y: 450,
      },
      textureKey: this.params.buttonTextureKey,
    })

    const creditTitles = this.params.credits.map((entry) => {
      return entry.position
    })

    const credits = this.params.credits.map((entry) => {
      return entry.names.join(', ')
    })

    let creditsY = 650
    for (let i = 0; i < creditTitles.length; i++) {
      new TextBuilder(this)
        .setText(creditTitles[i])
        .setDisplaySize(2000, 150)
        .setPosition({
          x: width / 2,
          y: creditsY,
        })
        .build()
        .value.setAlign('center')
        .setFontSize(34)

        .setLineSpacing(15)

      new TextBuilder(this)
        .setText(credits[i])
        .setDisplaySize(2000, 150)
        .setPosition({
          x: width / 2,
          y: creditsY + 40,
        })
        .build()
        .value.setAlign('center')
        .setFontSize(24)
        .setLineSpacing(15)

      creditsY += 130
    }

    // this.centerButtonList(buttonList, 3, 50)

    buttonList.addButton('Play', () => {
      ChangeSceneActivation.build(this, this.params.gameStartScene)()
    })

    this.add.existing(buttonList.build())

    const clickForSoundBg = new Phaser.GameObjects.Rectangle(this, 1280, 720, 2560, 1440, 0, 1)
    clickForSoundBg.setInteractive({
      draggable: false,
      pixelPerfect: false,
      alphaTolerance: undefined,
      useHandCursor: false,
    })
    clickForSoundBg.setDepth(10000)

    this.add.existing(clickForSoundBg)

    const clickForSound = new TextBuilder(this)
      .setText('Click to begin')
      .setDisplaySize(2560, 400)
      .setPosition({
        x: 1280,
        y: 600,
      })
      .build()
    clickForSound.value.setFontSize(50)
    clickForSound.value.setDepth(10000 + 100)

    clickForSoundBg.on('pointerdown', () => {
      clickForSoundBg.destroy()
      clickForSound.value.destroy()
    })
  }
}
