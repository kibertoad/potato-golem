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
      this.turnsCombinedToCard = 0
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
    this.parentEventSink.emit('DESTROY', this)
  }

  getActivationForCombinedCard(combinedCard: CardModel): CardEffectDefinition | undefined {
    if (!combinedCard) {
      return undefined
    }

    const combinationEffect = this.definition.cardCombinationEffect?.[combinedCard.definition.id]

    if (!combinationEffect) {
      return undefined
    }

    return combinationEffect
  }

  processTurn(): void {
    this.turnsExisted++
    this.turnsStayedInZone++
    this.turnsCombinedToCard++

    const allApplicableActivations = this.findTriggeredActivations()
    const activationsTriggered = sortAndFilterActivations(allApplicableActivations)

    for (const activation of activationsTriggered) {
      activation.activate(this)
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
      const activation = this.getActivationForCombinedCard(this.combinedCard)
      if (activation?.timeTillTrigger <= this.turnsCombinedToCard) {
        relevantActivations.push(activation.effect)
      }
    }

    return relevantActivations
  }
}
