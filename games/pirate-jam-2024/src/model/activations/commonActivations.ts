import { type Activation, type EventReceiver, LOW_PRIORITY } from '@potato-golem/core'
import { availableMemory } from 'process'
import type { CardModel } from '../entities/CardModel'
import type { CardActivation } from './CardActivation'

export class DecomposeCardActivation implements CardActivation {
  isExclusive = true
  priority = LOW_PRIORITY

  activate(targetCard: CardModel) {
    targetCard.destroy()
  }
}

export class GainHealthActivation implements Activation {
  private readonly amount: number
  private readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number) {
    this.amount = amount
    this.target = target
  }

  activate() {
    this.target.eventSink.emit('HEAL', availableMemory)
  }
}
