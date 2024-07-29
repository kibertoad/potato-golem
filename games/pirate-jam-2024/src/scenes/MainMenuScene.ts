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
  private subTitle!: UIContainer<Phaser.GameObjects.Text>

  constructor({ musicScene }) {
    super(Scenes.MAIN_MENU_SCENE)
    this.musicScene = musicScene
  }

  init() {}

  preload() {
    this.load.image(ImageRegistry.ROCKET, require('../../assets/img/favicon.png'))
    this.load.image(ImageRegistry.BOARD_BACKGROUND, require('../../assets/img/homun_bkgd1.png'))
    this.load.image(ImageRegistry.GLASS_PANEL, require('../../assets/img/glass_panel.png'))
    this.load.image(ImageRegistry.CARD_GLOW, require('../../assets/img/card_glow.png'))
    this.load.image(ImageRegistry.CARD_FRAME, require('../../assets/img/card_background.png'))
    this.load.image(
      ImageRegistry.CARD_FRAME_DECOR,
      require('../../assets/img/card_background_decor.png'),
    )
    this.load.image(
      ImageRegistry.CARD_FRAME_EAT,
      require('../../assets/img/card_background_eat.png'),
    )
    this.load.image(
      ImageRegistry.CARD_FRAME_EAT_2,
      require('../../assets/img/card_background_eat_2.png'),
    )
    this.load.image(
      ImageRegistry.EVENTS_BACKGROUND,
      require('../../assets/img/event_background.png'),
    )

    this.load.image(ImageRegistry.HOMUNCULUS, require('../../assets/img/homunculus4.png'))

    // cards
    this.load.image(ImageRegistry.HEALTH_CARD, require('../../assets/img/card_image.png'))
    this.load.image(ImageRegistry.GOLD_CARD, require('../../assets/img/card_gold.png'))
    this.load.image(ImageRegistry.MONEY_CARD, require('../../assets/img/card_money.png'))
    this.load.image(ImageRegistry.MEDICINE_CARD, require('../../assets/img/card_medicine.png'))
    this.load.image(ImageRegistry.CORPSE_CARD, require('../../assets/img/card_corpse.png'))
    this.load.image(ImageRegistry.MERCHANT_CARD, require('../../assets/img/card_merchant.png'))
    this.load.image(
      ImageRegistry.ROUGH_KIND_CARD,
      require('../../assets/img/card_the_rough_kind.png'),
    )
    this.load.image(
      ImageRegistry.SHADOW_MUSE_CARD,
      require('../../assets/img/card_shadow_muse.png'),
    )
    this.load.image(ImageRegistry.THE_LAW_CARD, require('../../assets/img/card_the_law.png'))
    this.load.image(ImageRegistry.POISON_CARD, require('../../assets/img/card_poison.png'))
    this.load.image(
      ImageRegistry.ALCHEMICAL_SUPPLIES_CARD,
      require('../../assets/img/card_alchemical_supplies.png'),
    )
    this.load.image(ImageRegistry.BOOZE_CARD, require('../../assets/img/card_booze.png'))
    this.load.image(ImageRegistry.EXPLOSIVES_CARD, require('../../assets/img/card_explosives.png'))
    this.load.image(
      ImageRegistry.SINGING_MUSHROOMS_CARD,
      require('../../assets/img/singing_mushrooms.png'),
    )
    this.load.image(ImageRegistry.PORTAL_CARD, require('../../assets/img/the_portal.png'))
    this.load.image(ImageRegistry.THE_RAID_CARD, require('../../assets/img/the_raid.png'))
    this.load.image(
      ImageRegistry.ENLIGHTENED_MANDRAKE_CARD,
      require('../../assets/img/enlightened_mandrake.png'),
    )
    this.load.image(
      ImageRegistry.WATCHING_FLOWER_CARD,
      require('../../assets/img/watching_flower.png'),
    )

    // explosions
    this.load.image(ImageRegistry.EXPLOSION_1, require('../../assets/img/1_explosion.png'))
    this.load.image(ImageRegistry.EXPLOSION_2, require('../../assets/img/2_explosion.png'))
    this.load.image(ImageRegistry.EXPLOSION_3, require('../../assets/img/3_explosion.png'))
    this.load.image(ImageRegistry.EXPLOSION_4, require('../../assets/img/4_explosion.png'))
    this.load.image(ImageRegistry.EXPLOSION_5, require('../../assets/img/5_explosion.png'))

    //statuses
    this.load.image(ImageRegistry.HOMUNCULUS_HEART, require('../../assets/img/small_heart.png'))
    this.load.image(ImageRegistry.HOMUNCULUS_FOOD, require('../../assets/img/small_food.png'))
    this.load.image(ImageRegistry.TIME, require('../../assets/img/watch.png'))

    //animations
    this.load.image(ImageRegistry.CLOUD_1, require('../../assets/img/cloud_1.png'))
    this.load.image(ImageRegistry.CLOUD_2, require('../../assets/img/cloud_2.png'))
    this.load.image(ImageRegistry.CLOUD_3, require('../../assets/img/cloud_3.png'))
    this.load.image(ImageRegistry.CLOUD_4, require('../../assets/img/cloud_4.png'))

    this.load.image(ImageRegistry.BLOOD_1, require('../../assets/img/1_blood.png'))
    this.load.image(ImageRegistry.BLOOD_2, require('../../assets/img/2_blood.png'))
    this.load.image(ImageRegistry.BLOOD_3, require('../../assets/img/3_blood.png'))

    //other
    this.load.image(ImageRegistry.CHAT_BUBBLE, require('../../assets/img/chat_bubble.png'))
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
    })
    buttonList.addButton('Settings')
    buttonList.addButton('Credits')

    this.add.existing(buttonList.build())
    ChangeSceneActivation.build(this, Scenes.BOARD_SCENE)()
    this.musicScene.playMainTheme()
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
