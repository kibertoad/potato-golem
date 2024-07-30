import {
  type DescribedTargettedMultipleActivation,
  type EventSink,
  type TurnProcessor,
  generateUuid,
  sortAndFilterActivations,
} from '@potato-golem/core'
import type { CommonEntity } from '@potato-golem/core'
import type { CardView } from '../../scenes/board/views/CardView'
import type { CardDefinition, CardEffectDefinition } from '../definitions/cardDefinitions'
import { EntityTypeRegistry } from '../registries/entityTypeRegistry'
import type { Zone } from '../registries/zoneRegistry'

export type CardModelParams = {
  definition: CardDefinition
  zone: Zone
  parentEventSink: EventSink
}

export class CardModel implements TurnProcessor, CommonEntity {
  type = EntityTypeRegistry.CARD

  private readonly parentEventSink: EventSink
  readonly name: string
  readonly definition: CardDefinition

  combinedCard?: CardModel

  // uuid of a specific instance, not a definition id
  id: string

  zone: Zone
  view: CardView
  turnsExisted: number
  turnsStayedInZone: number
  turnsCombinedToCard: number

  constructor(params: CardModelParams) {
    this.id = generateUuid()
    this.definition = params.definition
    this.name = this.definition.name
    this.zone = params.zone
    this.parentEventSink = params.parentEventSink

    this.turnsExisted = 0
    this.turnsStayedInZone = 0
    this.turnsCombinedToCard = 0
  }

  combineWithCard(cardModel: CardModel) {
    if (cardModel !== this.combinedCard) {
      this.combinedCard = cardModel
      cardModel.combinedCard = this
      this.turnsCombinedToCard = 0
    }
  }

  disconnectFromCard() {
    if (this.combinedCard) {
      this.combinedCard.combinedCard = undefined
      this.combinedCard = undefined
    }
  }

  changeZone(zone: Zone): boolean {
    if (!this.definition.idleZoneEffect || !(zone in this.definition.idleZoneEffect)) {
      return false
    }

    const previousZone = this.zone

    this.zone = zone
    this.turnsStayedInZone = 0

    if (previousZone !== zone) {
      this.parentEventSink.emit('MOVE', this, previousZone, this.zone)
    }

    return true
  }

  destroy() {
    this.disconnectFromCard()
    this.parentEventSink.emit('DESTROY', this)
  }

  getActivationForCombinedCard(
    combinedCard: CardModel,
    includeCombined?: boolean,
    strict?: boolean,
  ): {
    effect: CardEffectDefinition | undefined
    failReason?: boolean | string
  } {
    // nothing is highlighted
    if (!combinedCard) {
      return {
        effect: undefined,
      }
    }

    // card is already busy
    if (!includeCombined && (combinedCard.combinedCard || this.combinedCard)) {
      return {
        effect: undefined,
      }
    }

    //Do not check combinations both ways in strict mode
    const combinationEffect = !strict
      ? this.definition.cardCombinationEffect?.[combinedCard.definition.id] ??
        combinedCard.definition.cardCombinationEffect?.[this.definition.id]
      : this.definition.cardCombinationEffect?.[combinedCard.definition.id]

    if (!combinationEffect) {
      return {
        effect: undefined,
      }
    }

    if (combinationEffect.preconditions) {
      //Temporarily set combined card to check preconditions
      const currentCombinedCard = this.combinedCard
      this.combinedCard = combinedCard
      let preconditionResult: boolean | string
      for (const precondition of combinationEffect.preconditions) {
        preconditionResult = precondition.isSatisfied(this)
        if (preconditionResult !== true) {
          this.combinedCard = currentCombinedCard
          return {
            effect: undefined,
            failReason: preconditionResult,
          }
        }
      }
      this.combinedCard = currentCombinedCard
    }

    return {
      effect: combinationEffect,
    }
  }

  hasActivationForZone(zone: Zone): boolean {
    return this.definition.idleZoneEffect?.[zone] !== undefined
  }

  async processTurn(): Promise<void> {
    console.log(`Processing turn for card "${this.definition.id}"`)
    this.turnsExisted++
    this.turnsStayedInZone++
    this.turnsCombinedToCard++

    const allApplicableActivations = this.findTriggeredActivations()
    const activationsTriggered = sortAndFilterActivations(allApplicableActivations)

    for (const activation of activationsTriggered) {
      await activation.activate(this)
    }
  }

  private findTriggeredActivations(): DescribedTargettedMultipleActivation<CardModel>[] {
    const relevantActivations: DescribedTargettedMultipleActivation<CardModel>[] = []

    if (this.definition.idleZoneEffect?.any?.timeTillTrigger <= this.turnsExisted) {
      relevantActivations.push(this.definition.idleZoneEffect.any.effect)
    }

    if (this.definition.idleZoneEffect?.[this.zone]?.timeTillTrigger <= this.turnsStayedInZone) {
      relevantActivations.push(this.definition.idleZoneEffect[this.zone].effect)
    }

    if (this.combinedCard) {
      const activation = this.getActivationForCombinedCard(this.combinedCard, true, true)
      if (activation?.effect && activation?.effect?.timeTillTrigger <= this.turnsCombinedToCard) {
        relevantActivations.push(activation.effect)
        this.disconnectFromCard()
      }
    }

    return relevantActivations
  }
}
