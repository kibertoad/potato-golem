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
        height: 500,
      })
      .build()

    const textStyle = {
      fontFamily: 'Arial', // Customize the font
      fontSize: '24px', // Customize the text size
      color: '#ffffff', // Customize the text color
      padding: { x: 25, y: 25 }, // Customize the padding
      wordWrap: { width: 500, useAdvancedWrap: true }, // Enable word wrap and set the width
    }

    // Create the text object with auto-wrap
    this.effectDescriptionText = this.potatoScene.add.text(0, 0, 'No effect', textStyle)

    this.add(this.background)
    this.add(this.effectDescriptionText)

    this.setPosition(100, 100)
    this.setDepth(DepthRegistry.EVENT)
    this.setVisible(false)

    this.scene.add.existing(this)
  }

  setText(text: string): void {
    this.effectDescriptionText.setText(text)
    this.updateBoxSize()
  }

  updateBoxSize() {
    const bounds = this.effectDescriptionText.getBounds()
    this.background.displayWidth = bounds.width
    this.background.displayHeight = bounds.height
  }

  showCardZoneEffect(cardView: CardView, zoneView: ZoneView) {
    let resolvedText = 'No effect'

    const idleZoneEffect = cardView.model.definition.idleZoneEffect?.[zoneView.id]
    if (idleZoneEffect) {
      const timeString = this.resolveTimeString(idleZoneEffect.timeTillTrigger)
      resolvedText = `${timeString}${idleZoneEffect.effect.getDescriptions().join(' \n')}`
    }

    this.setText(resolvedText)
  }

  private resolveTimeString(timeTillTrigger: number): string {
    return timeTillTrigger > 0
      ? `In ${timeTillTrigger} ${timeTillTrigger === 1 ? 'turn' : 'turns'} \n `
      : ''
  }

  showCardCombinationEffect(sourceCardView: CardView, targetCardView: CardView) {
    let resolvedText = 'No effect'

    const combinationResult = sourceCardView.model.getActivationForCombinedCard(
      targetCardView.model,
    )
    console.log(combinationResult)
    if (combinationResult.effect) {
      const timeString = this.resolveTimeString(combinationResult.effect.timeTillTrigger)
      resolvedText = `${timeString}${combinationResult.effect.effect.getDescriptions().join(' \n')}`
    }

    if (typeof combinationResult.failReason === 'string') {
      resolvedText = combinationResult.failReason
    }

    this.setText(resolvedText)
  }

  show() {
    this.setVisible(true)
  }

  hide() {
    this.setVisible(false)
  }
}
