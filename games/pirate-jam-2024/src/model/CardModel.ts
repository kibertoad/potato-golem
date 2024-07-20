import {
  type EventSink,
  type TurnProcessor,
  generateUuid,
  sortAndFilterActivations,
} from '@potato-golem/core'
import type { CommonEntity } from '@potato-golem/core'
import type { CardActivation } from './activations/CardActivation'
import type { CardDefinition } from './definitions/cardDefinitions'
import { EntityTypeRegistry } from './registries/entityTypeRegistry'
import type { Zone } from './registries/zoneRegistry'

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

  id: string
  zone: Zone
  turnsExisted: number
  turnsStayedInZone: number

  constructor(params: CardModelParams) {
    this.id = generateUuid()
    this.definition = params.definition
    this.name = this.definition.name
    this.zone = params.zone
    this.parentEventSink = params.parentEventSink

    this.turnsExisted = 0
    this.turnsStayedInZone = 0
  }

  changeZone(zone: Zone): void {
    this.zone = zone
    this.turnsStayedInZone = 0
  }
  1
  destroy() {
    this.parentEventSink.emit('DESTROY', this)
  }

  processTurn(): void {
    this.turnsExisted++
    this.turnsStayedInZone++

    const allApplicableActivations = this.findTriggeredActivations()
    const activationsTriggered = sortAndFilterActivations(allApplicableActivations)

    for (const activation of activationsTriggered) {
      activation.activate(this)
    }
  }

  private findTriggeredActivations(): CardActivation[] {
    const relevantActivations: CardActivation[] = []

    if (this.definition.idleZoneEffect.any?.timeTillTrigger <= this.turnsExisted) {
      relevantActivations.push(this.definition.idleZoneEffect.any.effect)
    }

    if (this.definition.idleZoneEffect[this.zone]?.timeTillTrigger <= this.turnsStayedInZone) {
      relevantActivations.push(this.definition.idleZoneEffect[this.zone].effect)
    }

    return relevantActivations
  }
}
