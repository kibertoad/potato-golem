import { type PotatoScene, SpriteBuilder } from '@potato-golem/ui'
import Phaser from 'phaser'
import Sprite = Phaser.GameObjects.Sprite
import { ImageRegistry } from '../../../model/registries/imageRegistry'
import Container = Phaser.GameObjects.Container
import { type DynamicDescriptionsHolder, isDynamicDescriptionsHolder } from '@potato-golem/core'
import type { CardDefinitions } from '../../../model/definitions/cardDefinitionsNew'
import { DepthRegistry } from '../../../model/registries/depthRegistry'
import { CardView, type DirectionResult } from './CardView'
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
      wordWrap: { width: 600, useAdvancedWrap: true }, // Enable word wrap and set the width
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

    if (text === '') {
      this.hide()
      return
    }

    this.show()
  }

  updateBoxSize() {
    const bounds = this.effectDescriptionText.getBounds()
    this.background.displayWidth = bounds.width
    this.background.displayHeight = bounds.height
  }

  showCardZoneEffect(cardView: CardView, zoneView: ZoneView) {
    let resolvedText = ''

    const idleZoneEffect = cardView.model.definition.idleZoneEffect?.[zoneView.id]
    if (idleZoneEffect) {
      const timeString = this.resolveTimeString(idleZoneEffect.timeTillTrigger)
      /*
      resolvedText =
        idleZoneEffect.tooltip ||
        `${timeString}${idleZoneEffect.effect.getDescriptions().join(' \n')}`

       */

      if (idleZoneEffect.tooltip) {
        resolvedText = idleZoneEffect.tooltip
      } else {
        resolvedText = `${timeString}`
        for (const effect of idleZoneEffect.effect) {
          resolvedText += (effect as unknown as DynamicDescriptionsHolder).getDescriptions()
        }
      }
    }

    this.setText(resolvedText)
    this.moveWithCard(cardView)
  }

  private resolveTimeString(timeTillTrigger: number): string {
    return timeTillTrigger > 0
      ? `In ${timeTillTrigger} ${timeTillTrigger === 1 ? 'turn' : 'turns'} \n `
      : ''
  }

  showCardCombinationEffect(sourceCardView: CardView, targetCardView: CardView) {
    let resolvedText = ''

    const combinationResult = sourceCardView.model.getActivationForCombinedCard(
      targetCardView.model,
    )
    console.log(combinationResult)
    if (combinationResult.effect) {
      //const timeString = this.resolveTimeString(combinationResult.effect.timeTillTrigger)
      const timeString = 'dummy value, fix later'
      //resolvedText =
      //  combinationResult.effect.tooltip ||
      //  `${timeString}${combinationResult.effect.effect.getDescriptions().join(' \n')}`

      if (combinationResult.effect.tooltip) {
        resolvedText = combinationResult.effect.tooltip
      } else {
        resolvedText = `${timeString}`
        for (const effect of combinationResult.effect.effects) {
          if (isDynamicDescriptionsHolder(effect)) {
            resolvedText += effect.getDescription()
          }
        }
      }
    }

    if (typeof combinationResult.failReason === 'string') {
      resolvedText = combinationResult.failReason
    }

    this.setText(resolvedText)
    this.moveWithCard(sourceCardView)
  }

  moveWithCard(cardView: CardView) {
    const direction: DirectionResult = cardView.getChatBubbleDirection()

    let x = cardView.x
    if (direction.horizontal === 'left') {
      x -= this.background.displayWidth
      x -= CardView.cardWidth / 2 + 20
    } else {
      x += CardView.cardWidth / 2 + 20
    }

    this.setPosition(x, cardView.y - CardView.cardHeight / 2)
  }

  show() {
    this.setVisible(true)
  }

  hide() {
    this.setVisible(false)
  }
}
