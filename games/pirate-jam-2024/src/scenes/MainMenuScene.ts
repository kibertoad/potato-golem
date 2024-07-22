import { ChangeSceneActivation, PotatoScene, TextBuilder, type UIContainer } from '@potato-golem/ui'
import Phaser from 'phaser'

import { ImageRegistry } from '../model/registries/imageRegistry'
import type { MusicScene } from './MusicScene'
import { Scenes } from './SceneRegistry'
import Container = Phaser.GameObjects.Container
import { ButtonListBuilder } from '../builders/ButtonListBuilder'

export class MainMenuScene extends PotatoScene {
  private buttons: Container[] = []
  private selectedButtonIndex = 0
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private musicScene: MusicScene
  private readonly subTitle: UIContainer<Phaser.GameObjects.Text>

  constructor({ musicScene }) {
    super(Scenes.MAIN_MENU_SCENE)
    this.musicScene = musicScene
  }

  init() {}

  preload() {
    this.load.image(ImageRegistry.ROCKET, require('../../assets/img/favicon.png'))
    this.load.image(ImageRegistry.BOARD_BACKGROUND, require('../../assets/img/homun_bkgd1.png'))
    this.load.image(ImageRegistry.GLASS_PANEL, require('../../assets/img/glass_panel.png'))
    this.load.image(ImageRegistry.CARD_FRAME, require('../../assets/img/card_background.png'))

    // cards
    this.load.image(ImageRegistry.HEALTH_CARD, require('../../assets/img/card_image.png'))
    this.load.image(ImageRegistry.GOLD_CARD, require('../../assets/img/card_gold.png'))
    this.load.image(ImageRegistry.MEDICINE_CARD, require('../../assets/img/card_medicine.png'))
    this.load.image(ImageRegistry.CORPSE_CARD, require('../../assets/img/card_corpse.png'))
  }

  create() {
    const { width, height } = this.scale

    this.subTitle = new TextBuilder(this)
      .setText('Discount Store Alchemist')
      .setDisplaySize(250, 150)
      .setPosition({ x: width * 0.3, y: height * 0.2 })
      .build()

    const buttonList = new ButtonListBuilder(this, {
      depth: 100,
      distance: 20,
      height: 50,
      width: 300,
      orientation: 'vertical',
      hoverTint: 0x66ff7f,
      position: {
        x: width / 2,
        y: height / 2,
      },
      textureKey: ImageRegistry.GLASS_PANEL,
    })

    // this.centerButtonList(buttonList, 3, 50)

    buttonList.addButton('Play', () => {
      ChangeSceneActivation.build(this, Scenes.BOARD_SCENE)()
      this.musicScene.fadeOutMainTheme()
    })
    buttonList.addButton('Settings')
    buttonList.addButton('Credits')
  }

  centerButtonList(buttonList: ButtonListBuilder, buttonCount: number, spacingOffsetY = 0) {
    /*
    buttonList.setExactPosition(
      this.scale.width / 2,
      this.scale.height / 2 -
        (buttonCount * buttonList.displaySizeY + (buttonCount - 1) * spacingOffsetY) / 2,
    )

     */
  }

  update() {}
}
