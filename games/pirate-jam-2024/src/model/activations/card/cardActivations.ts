import {
  type Activation,
  type DynamicDescriptionHolder,
  type EventReceiver,
  type EventSink,
  LOW_PRIORITY,
  type QueuedActivation,
  type StaticDescriptionHolder,
} from '@potato-golem/core'
import type { BoardSupportedEvents } from '../../../scenes/board/BoardScene'
import type { EventId } from '../../definitions/eventDefinitions'
import type { CardModel } from '../../entities/CardModel'
import type { Zone } from '../../registries/zoneRegistry'
import type { WorldModel } from '../../state/WorldModel'
import type { CardActivation } from './CardActivation'

export class DecomposeCardActivation implements CardActivation, DynamicDescriptionHolder {
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

export class DecomposeBothCardsActivation implements CardActivation, DynamicDescriptionHolder {
  isExclusive = true
  priority = LOW_PRIORITY

  async activate(targetCard: CardModel) {
    await Promise.all([
      targetCard.view.playPoofAnimation(),
      targetCard.combinedCard.view.playPoofAnimation(),
    ])

    targetCard.destroy()
    targetCard.combinedCard.destroy()
  }

  getDescription(): string {
    return 'Consume both cards'
  }
}

export class EatCardActivation implements CardActivation, DynamicDescriptionHolder {
  isExclusive = true
  priority = LOW_PRIORITY

  async activate(targetCard: CardModel) {
    await targetCard.view.playEatAnimation()
    targetCard.destroy()
  }

  getDescription(): string {
    return 'Consume card'
  }
}

export class MoveToZoneCardActivation implements CardActivation, DynamicDescriptionHolder {
  isExclusive = true
  priority = LOW_PRIORITY

  private readonly worldModel: WorldModel
  private readonly targetZone: Zone
  private readonly chatPhrases?: string[]

  constructor(worldModel: WorldModel, targetZones: Zone | Zone[], chatPhrases?: string[]) {
    this.worldModel = worldModel
    this.chatPhrases = chatPhrases

    this.targetZone = Array.isArray(targetZones)
      ? targetZones[Math.floor(Math.random() * targetZones.length)]
      : targetZones
  }

  async activate(targetCard: CardModel) {
    const targetZoneView = this.worldModel.zones[this.targetZone]
    targetCard.changeZone(this.targetZone)
    const availableSpawnPont = targetZoneView.findAvailableSpawnPoint(targetCard.view)
    await targetCard.view.animateMoveTo({
      x: availableSpawnPont.x,
      y: availableSpawnPont.y,
    })
    if (this.chatPhrases) {
      targetCard.view.say(this.chatPhrases)
    }
  }

  getDescription(): string {
    return 'Consume card'
  }
}

export class GainHealthActivation implements Activation, DynamicDescriptionHolder {
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

export class DamageActivation implements Activation, DynamicDescriptionHolder {
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

export class GainConscienceActivation implements Activation, DynamicDescriptionHolder {
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

export class GainHatredActivation implements Activation, DynamicDescriptionHolder {
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

export class FeedActivation implements Activation, DynamicDescriptionHolder {
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

export class QueueActivation implements Activation, StaticDescriptionHolder {
  private readonly activation: QueuedActivation
  private readonly eventSink: EventSink<BoardSupportedEvents>
  readonly description: string

  constructor(eventSink: EventSink<BoardSupportedEvents>, activation: QueuedActivation) {
    this.activation = activation
    this.eventSink = eventSink
    this.description = activation.description ?? ''
  }

  activate() {
    this.eventSink.emit('QUEUE_ACTIVATION', this.activation)
  }
}

export class StartEventActivation implements Activation, DynamicDescriptionHolder {
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
