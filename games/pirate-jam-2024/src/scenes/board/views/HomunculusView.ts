import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import { type PotatoScene, SpriteBuilder } from '@potato-golem/ui'
import type { HomunculusModel } from '../../../model/entities/HomunculusModel'
import { DepthRegistry } from '../../../model/registries/depthRegistry'
import { ImageRegistry } from '../../../model/registries/imageRegistry'
import { SfxRegistry } from '../../../model/registries/sfxRegistry'
import { worldModel } from '../../../model/state/WorldModel'
import { delay } from '../../../utils/timeUtils'
import { CardView } from './CardView'

export type HomunculusDependencies = {
  model: HomunculusModel
}

export class HomunculusView extends Container {
  private readonly model: HomunculusModel

  private readonly homunculusSprite: Phaser.GameObjects.Sprite
  private readonly cardBloodSplatSprite: Phaser.GameObjects.Sprite

  private readonly hearts: Phaser.GameObjects.Sprite[] = []
  private readonly food: Phaser.GameObjects.Sprite[] = []
  private evolutionText: Phaser.GameObjects.Text

  private initialYPosition = 672

  constructor(scene: PotatoScene, dependencies: HomunculusDependencies) {
    super(scene)

    this.model = dependencies.model

    this.homunculusSprite = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.HOMUNCULUS)
      .setPosition({
        x: 1265,
        y: 672,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(350)
      .setHeight(350)
      .setDepth(DepthRegistry.HOMUNCULUS)
      .build()

    this.add(this.homunculusSprite)
    scene.add.existing(this.homunculusSprite)

    for (let i = 0; i < this.model.hp.value; i++) {
      const heart = SpriteBuilder.instance(scene)
        .setTextureKey(ImageRegistry.HOMUNCULUS_HEART)
        .setPosition({
          x: 1120,
          y: 668 + i * 55,
        })
        .setOrigin(0.5, 0.5)
        .setWidth(40)
        .setHeight(40)
        .setDepth(DepthRegistry.HOMUNCULUS)
        .build()

      this.add(heart)
      scene.add.existing(heart)
      this.hearts.push(heart)
    }

    for (let i = 0; i < this.model.food.value; i++) {
      const food = SpriteBuilder.instance(scene)
        .setTextureKey(ImageRegistry.HOMUNCULUS_FOOD)
        .setPosition({
          x: 1440,
          y: 668 + i * 55,
        })
        .setOrigin(0.5, 0.5)
        .setWidth(40)
        .setHeight(40)
        .setDepth(DepthRegistry.HOMUNCULUS)
        .build()

      this.add(food)
      scene.add.existing(food)
      this.food.push(food)
    }

    this.cardBloodSplatSprite = SpriteBuilder.instance(scene)
      .setTextureKey(ImageRegistry.BLOOD_1)
      .setPosition({
        x: 1280,
        y: 720,
      })
      .setOrigin(0.5, 0.5)
      .setWidth(CardView.cardWidth)
      .setHeight(CardView.cardHeight)
      .build()
    this.cardBloodSplatSprite.setVisible(false)
    this.cardBloodSplatSprite.setDepth(500)
    this.add(this.cardBloodSplatSprite)
    scene.add.existing(this.cardBloodSplatSprite)


    const textStyle = {
      padding: {
        x: 30,
        y: 30,
      },
      fontFamily: 'Arial', // Customize the font
      fontSize: '34px', // Customize the text size
      color: '#ffffff', // Customize the text color
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#000000FF',
        blur: 5,
        stroke: true,
        fill: true,
      },
    }

    // Create the text object with auto-wrap
    this.evolutionText = this.scene.add.text(
      0,
      0,
      this.model.evolution.value.toString(),
      textStyle,
    )
      .setPosition(
        1240,
      800,
      )
      .setDepth(DepthRegistry.HOMUNCULUS)
    this.add(this.evolutionText)
    scene.add.existing(this.evolutionText)

    this.model.eventSink.on('HEAL', (_hp: number) => this.updateHpDisplay())
    this.model.eventSink.on('DAMAGE', (_hp: number) => this.updateHpDisplay())
    this.model.eventSink.on('FEED', (_amount: number) => this.updateFoodDisplay())
    this.model.eventSink.on('STARVE', (_amount: number) => this.updateFoodDisplay())
    this.model.eventSink.on('EVOLVE', (amount: number) => this.evolutionText.setText(this.model.evolution.value.toString()))
    this.model.eventSink.on('ATTACKED', () => this.playBloodSplatAnimation())
  }

  updateHpDisplay() {
    for (let i = 0; i < this.hearts.length; i++) {
      this.hearts[i].setVisible(i < this.model.hp.value)
    }
  }

  updateFoodDisplay() {
    for (let i = 0; i < this.food.length; i++) {
      this.food[i].setVisible(i < this.model.food.value)
    }

    if (this.model.food.value > 0) {
      this.homunculusSprite.setTexture(ImageRegistry.HOMUNCULUS)
      this.homunculusSprite.y = this.initialYPosition
    } else {
      this.homunculusSprite.setTexture(ImageRegistry.HOMUNCULUS_HUNGRY)
      this.homunculusSprite.y = this.initialYPosition + 40
    }
  }

  async playBloodSplatAnimation() {
    this.cardBloodSplatSprite.setVisible(true)
    this.cardBloodSplatSprite.setAlpha(1)
    await this.cardBloodSplatSprite.play('blood_splat')

    const splatSounds = [SfxRegistry.SLASH_SPLAT_1, SfxRegistry.SLASH_SPLAT_2]

    worldModel.musicScene.playSfx(splatSounds[Math.floor(Math.random() * splatSounds.length)])

    this.scene.tweens.add({
      targets: this.cardBloodSplatSprite,
      alpha: 0,
      delay: 400,
      duration: 700,
      ease: 'Cubic',
    })
    this.scene.tweens.add({
      targets: this.cardBloodSplatSprite,
      y: this.cardBloodSplatSprite.y + 200,
      delay: 200,
      duration: 1000,
      ease: 'Sine',
      onComplete: () => {
        this.cardBloodSplatSprite.setVisible(false)
        this.cardBloodSplatSprite.x = 1280
        this.cardBloodSplatSprite.y = 720
      },
    })
    await delay(1200)
  }
}
