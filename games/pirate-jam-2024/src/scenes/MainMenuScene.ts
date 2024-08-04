import { ChangeSceneActivation, PotatoScene, TextBuilder, type UIContainer } from '@potato-golem/ui'
import Phaser from 'phaser'

import { ImageRegistry } from '../model/registries/imageRegistry'
import type { MusicScene } from './MusicScene'
import { Scenes } from './SceneRegistry'
import Container = Phaser.GameObjects.Container
import { ButtonListBuilder } from '../builders/ButtonListBuilder'
import { FMODStudio } from '../initFmodGame'

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
    this.load.image(ImageRegistry.FOOD_CARD, require('../../assets/img/food.png'))
    this.load.image(ImageRegistry.BOARD_BACKGROUND, require('../../assets/img/homun_bkgd1.png'))
    this.load.image(ImageRegistry.GLASS_PANEL, require('../../assets/img/glass_panel.png'))
    this.load.image(ImageRegistry.CARD_GLOW, require('../../assets/img/card_glow.png'))
    this.load.image(ImageRegistry.CARD_GLOW_RED, require('../../assets/img/card_glow_red.png'))
    this.load.image(ImageRegistry.CARD_FRAME, require('../../assets/img/card_background.png'))
    this.load.image(ImageRegistry.CARD_FRAME_NAILS, require('../../assets/img/nails.png'))
    this.load.image(
      ImageRegistry.CARD_FRAME_DECOR,
      require('../../assets/img/card_background_decor.png'),
    )
    this.load.image(ImageRegistry.CARD_FRAME_HANDY, require('../../assets/img/handy.png'))
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
    this.load.image(ImageRegistry.HOMUNCULUS_HUNGRY, require('../../assets/img/homunculus2.png'))

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
    this.load.image(ImageRegistry.SONECHKA, require('../../assets/img/card_sonechka.png'))
    this.load.image(ImageRegistry.THE_ID_CARD, require('../../assets/img/card_the_id.png'))
    this.load.image(ImageRegistry.POISON_CARD, require('../../assets/img/card_poison.png'))
    this.load.image(
      ImageRegistry.POISON_MOLD_CARD,
      require('../../assets/img/card_poison_mold.png'),
    )
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
    this.load.image(
      ImageRegistry.WORKBENCH_CARD,
      require('../../assets/img/alchemical_reaction_off.png'),
    )
    this.load.image(
      ImageRegistry.WORKBENCH_CARD_ON,
      require('../../assets/img/alchemical_reaction_on.png'),
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

    const musicDesc = { val: null }
    const music = { val: null }

    console.log(FMODStudio.getEvent('event:/Music/main_menu_theme', musicDesc))
    musicDesc.val.createInstance(music)

    this.music = music.val
  }

  music = null

  create() {
    const { width, height } = this.scale

    this.subTitle = new TextBuilder(this)
      .setText('We Have Homunculus at Home')
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
      textureKey: ImageRegistry.GLASS_PANEL,
    })

    const creditTitles: string[] = []
    creditTitles.push(`Art and Animation`)
    creditTitles.push(`Programming`)
    creditTitles.push(`Music and Sound`)
    creditTitles.push(`Game design and Testing`)

    const credits: string[] = []
    credits.push(`Anton Tamarin`)
    credits.push(`Igor Savin, Arturs Ziborovs`)
    credits.push(`Arturs Ziborovs`)
    credits.push(`Anton Tamarin, Igor Savin, Arturs Ziborovs, Fjodors Levkins`)

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
      ChangeSceneActivation.build(this, Scenes.BOARD_SCENE)()
    })

    this.add.existing(buttonList.build())
    // ChangeSceneActivation.build(this, Scenes.BOARD_SCENE)()
    // this.musicScene.playMainTheme()

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
      .setText('Click for sound')
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

    this.music.start()

    setTimeout(() => {
      console.log('Release')
      // this.music.stop()
    }, 3000)
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
}
