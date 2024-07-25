import {
  type Activation,
  type EventReceiver,
  type EventSink,
  LOW_PRIORITY,
} from '@potato-golem/core'
import type { BoardSupportedEvents } from '../../../scenes/board/BoardScene'
import type { EventId } from '../../definitions/eventDefinitions'
import type { CardModel } from '../../entities/CardModel'
import type { CardActivation } from './CardActivation'

export class DecomposeCardActivation implements CardActivation {
  isExclusive = true
  priority = LOW_PRIORITY

  async activate(targetCard: CardModel) {
    await targetCard.view.playPoofAnimation()
    targetCard.destroy()
  }

  getDescription(): string {
    return 'Remove card'
  }
}

export class EatCardActivation implements CardActivation {
  isExclusive = true
  priority = LOW_PRIORITY

  async activate(targetCard: CardModel) {
    await targetCard.view.playEatAnimation()
    targetCard.destroy()
  }

  getDescription(): string {
    return 'Remove card after eating animation'
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
    this.target.eventSink.emit('HEAL', this.amount)
  }

  getDescription(): string {
    return `Gain ${this.amount} health`
  }
}

export class DamageActivation implements Activation {
  private readonly amount: number
  private readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number) {
    this.amount = amount
    this.target = target
  }

  activate() {
    this.target.eventSink.emit('DAMAGE', this.amount)
  }

  getDescription(): string {
    return `Lose ${this.amount} health`
  }
}

export class GainConscienceActivation implements Activation {
  private readonly amount: number
  private readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number) {
    this.amount = amount
    this.target = target
  }

  activate() {
    this.target.eventSink.emit('GAIN_CONSCIENCE', this.amount)
  }

  getDescription(): string {
    return `Homunculus gets ${this.amount} conscience`
  }
}

export class GainHatredActivation implements Activation {
  private readonly amount: number
  private readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number) {
    this.amount = amount
    this.target = target
  }

  activate() {
    this.target.eventSink.emit('GAIN_HATRED', this.amount)
  }

  getDescription(): string {
    return `Homunculus gets ${this.amount} hatred`
  }
}

export class FeedActivation implements Activation {
  private readonly amount: number
  private readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number) {
    this.amount = amount
    this.target = target
  }

  activate() {
    this.target.eventSink.emit('FEED', this.amount)
  }

  getDescription(): string {
    return `Homunculus gets ${this.amount} satiation`
  }
}

export class StartEventActivation implements Activation {
  private readonly eventId: EventId
  private readonly eventSink: EventSink<BoardSupportedEvents>

  constructor(eventId: EventId, eventSink: EventSink<BoardSupportedEvents>) {
    this.eventId = eventId
    this.eventSink = eventSink
  }

  activate() {
    this.eventSink.emit('START_EVENT', this.eventId)
  }

  getDescription(): string {
    return `Start event`
  }
}
