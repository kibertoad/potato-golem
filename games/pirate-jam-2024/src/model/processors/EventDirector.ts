import {
  type EventSink,
  type QueuedActivation,
  type TurnProcessor,
  normalizedRandom,
  randomOneOf,
} from '@potato-golem/core'
import type { BoardSupportedEvents } from '../../scenes/board/BoardScene'
import type { EventDefinition, EventDefinitions, EventId } from '../definitions/eventDefinitions'
import type { CardModel } from '../entities/CardModel'

export class EventDirector implements TurnProcessor {
  private readonly eventsPlayed: Partial<Record<EventId, number>> = {}
  private readonly eventDefinitions: EventDefinitions
  private readonly eventSink: EventSink<BoardSupportedEvents>

  private readonly queuedActivations: Array<{
    activation: QueuedActivation
    arguments: Array<any>
  }> = []
  private readonly recurringActivations: QueuedActivation[] = []

  private counterTillNextEvent: number

  constructor(eventDefinitions: EventDefinitions, eventSink: EventSink<BoardSupportedEvents>) {
    this.eventDefinitions = eventDefinitions
    this.eventSink = eventSink
    this.resetCounter()
  }

  resetCounter() {
    this.counterTillNextEvent = normalizedRandom(5)
  }

  addQueuedActivation(activation: QueuedActivation, targetCard?: CardModel) {
    if (activation.unique) {
      if (this.queuedActivations.some((entry) => entry.activation.id === activation.id)) {
        return
      }
    }

    this.queuedActivations.push({
      activation,
      arguments: [targetCard, 'test'],
    })
  }

  addRecurringActivation(activation: QueuedActivation) {
    if (activation.unique) {
      if (this.recurringActivations.some((entry) => entry.id === activation.id)) {
        return
      }
    }

    this.recurringActivations.push(activation)
  }

  async processTurn() {
    await this.processRecurringActivations()
    await this.processQueuedActivations()
    await this.processRandomEvents()
  }

  private async processQueuedActivations(): Promise<void> {
    while (this.queuedActivations.length > 0) {
      const nextActivation = this.queuedActivations[0]
      const isReady = nextActivation.activation.processTime(1)
      if (isReady) {
        await nextActivation.activation.activate.apply(
          nextActivation.activation,
          nextActivation.arguments,
        )
        this.queuedActivations.shift()
      }
    }
  }

  private async processRecurringActivations(): Promise<void> {
    for (const activation of this.recurringActivations) {
      const isReady = activation.processTime(1)
      if (isReady) {
        await activation.activate()
        activation.resetTime()
      }
    }
  }

  private async processRandomEvents(): Promise<void> {
    this.counterTillNextEvent--
    if (this.counterTillNextEvent > 0) {
      return
    }

    const eligibleEvents = this.resolveEligibleEvents()

    // ToDo prioritize one of the least played events

    const eventToPlay = randomOneOf(eligibleEvents)

    // There is an event dialog to display
    if (eventToPlay.options) {
      this.eventSink.emit('START_EVENT', eventToPlay.id)
    }
    if (eventToPlay.effect) {
      await eventToPlay.effect.activate()
    }
    this.resetCounter()
  }

  resolveEligibleEvents(): readonly EventDefinition[] {
    return Object.values(this.eventDefinitions).filter((entry: EventDefinition) => {
      return entry.playableByDirector
    })
  }
}
