import { type PotatoScene, SpriteBuilder } from '@potato-golem/ui'
import Phaser from 'phaser'
import Sprite = Phaser.GameObjects.Sprite
import type { CardDefinitions } from '../../../model/definitions/cardDefinitions'
import { ImageRegistry } from '../../../model/registries/imageRegistry'
import Container = Phaser.GameObjects.Container
import { DepthRegistry } from '../../../model/registries/depthRegistry'
import type { CardView } from './CardView'
import type { ZoneView } from './ZoneView'

export type CardEffectViewDependencies = {
  cardDefinitions: CardDefinitions
}

export class CardEffectView extends Container {
  private readonly potatoScene: PotatoScene
  private readonly background: Sprite
  private effectDescriptionText: Phaser.GameObjects.Text

  constructor(potatoScene: PotatoScene, dependencies: CardEffectViewDependencies) {
    super(potatoScene)
    this.potatoScene = potatoScene

    this.background = SpriteBuilder.instance(this.potatoScene)
      .setTextureKey(ImageRegistry.EVENTS_BACKGROUND)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0, 0)
      .setDimensions({
        width: 500,
        height: 300,
      })
      .build()

    const textStyle = {
      fontFamily: 'Arial', // Customize the font
      fontSize: '24px', // Customize the text size
      color: '#ffffff', // Customize the text color
      wordWrap: { width: 500, useAdvancedWrap: true }, // Enable word wrap and set the width
    }

    // Create the text object with auto-wrap
    this.effectDescriptionText = this.potatoScene.add.text(100, 100, 'No effect', textStyle)

    this.add(this.background)
    this.add(this.effectDescriptionText)

    this.setPosition(100, 100)
    this.setDepth(DepthRegistry.EVENT)
    this.setVisible(false)

    this.scene.add.existing(this)
  }

  showCardZoneEffect(cardView: CardView, zoneView: ZoneView) {
    let resolvedText = 'No effect'

    const idleZoneEffect = cardView.model.definition.idleZoneEffect?.[zoneView.id]
    if (idleZoneEffect) {
      resolvedText = `In ${idleZoneEffect.timeTillTrigger} ${idleZoneEffect.timeTillTrigger === 1 ? 'turn' : 'turns'} \n ${idleZoneEffect.effect.getDescriptions().join(' \n')}`
    }

    this.effectDescriptionText.setText(resolvedText)
  }

  showCardCombinationEffect(sourceCardView: CardView, targetCardView: CardView) {
    let resolvedText = 'No effect'

    const combinationEffect = sourceCardView.model.getActivationForCombinedCard(
      targetCardView.model,
    )
    if (combinationEffect) {
      const timeString =
        combinationEffect.timeTillTrigger > 0
          ? `In ${combinationEffect.timeTillTrigger} ${combinationEffect.timeTillTrigger === 1 ? 'turn' : 'turns'} \n `
          : ''
      resolvedText = `${timeString}${combinationEffect.effect.getDescriptions().join(' \n')}`
    }

    this.effectDescriptionText.setText(resolvedText)
  }

  show() {
    this.setVisible(true)
  }

  hide() {
    this.setVisible(false)
  }
}
