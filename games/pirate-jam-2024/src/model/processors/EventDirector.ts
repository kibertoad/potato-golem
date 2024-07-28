import {
  type EventSink,
  type QueuedActivation,
  type TurnProcessor,
  normalizedRandom,
  randomOneOf,
} from '@potato-golem/core'
import type { BoardSupportedEvents } from '../../scenes/board/BoardScene'
import type { EventDefinition, EventDefinitions, EventId } from '../definitions/eventDefinitions'

export class EventDirector implements TurnProcessor {
  private readonly eventsPlayed: Partial<Record<EventId, number>> = {}
  private readonly eventDefinitions: EventDefinitions
  private readonly eventSink: EventSink<BoardSupportedEvents>

  private readonly queuedActivations: QueuedActivation[] = []
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

  addQueuedActivation(activation: QueuedActivation) {
    if (activation.unique) {
      if (this.queuedActivations.some((entry) => entry.id === activation.id)) {
        return
      }
    }

    this.queuedActivations.push(activation)
  }

  addRecurringActivation(activation: QueuedActivation) {
    if (activation.unique) {
      if (this.recurringActivations.some((entry) => entry.id === activation.id)) {
        return
      }
    }

    this.recurringActivations.push(activation)
  }

  processTurn(): void {
    this.processRecurringActivations()
    this.processQueuedActivations()
    this.processRandomEvents()
  }

  private processQueuedActivations() {
    while (this.queuedActivations.length > 0) {
      const nextActivation = this.queuedActivations[0]
      const isReady = nextActivation.processTime(1)
      if (isReady) {
        nextActivation.activate()
        this.queuedActivations.shift()
      }
    }
  }

  private processRecurringActivations() {
    for (const activation of this.recurringActivations) {
      const isReady = activation.processTime(1)
      if (isReady) {
        activation.activate()
        activation.resetTime()
      }
    }
  }

  private processRandomEvents() {
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
      eventToPlay.effect.activate()
    }
    this.resetCounter()
  }

  resolveEligibleEvents(): readonly EventDefinition[] {
    return Object.values(this.eventDefinitions).filter((entry: EventDefinition) => {
      return entry.playableByDirector
    })
  }
}
