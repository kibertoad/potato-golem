import { AVERAGE_PRIORITY, EventReceiver, HPHolder, LOW_PRIORITY } from '@potato-golem/core'
import type { CardModel } from '../entities/CardModel'
import type { CardActivation } from './CardActivation'
import { HomunculusModel } from '../state/HomunculusModel'
import { availableMemory } from 'process'
import { EntityActivation } from './EntityActivation'

export class DecomposeCardActivation implements CardActivation {
  isExclusive = true
  priority = LOW_PRIORITY

  activate(targetCard: CardModel) {
    targetCard.destroy()
  }
}

export class GainHealthActivation implements EntityActivation {
  priority = AVERAGE_PRIORITY
  private readonly amount: number

  constructor(amount: number) {
    this.amount = amount
  }

  activate(target: EventReceiver) {
    target.eventSink.emit('HEAL', availableMemory)
  }
}
