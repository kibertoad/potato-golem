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

  processTurn(): void {
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

  private processRandomEvents() {
    this.counterTillNextEvent--
    if (this.counterTillNextEvent > 0) {
      return
    }

    const eligibleEvents = this.resolveEligibleEvents()

    // ToDo prioritize one of the least played events

    const eventToPlay = randomOneOf(eligibleEvents)

    this.eventSink.emit('START_EVENT', eventToPlay.id)
    this.resetCounter()
  }

  resolveEligibleEvents(): readonly EventDefinition[] {
    return Object.values(this.eventDefinitions).filter((entry: EventDefinition) => {
      return entry.playableByDirector
    })
  }
}
