import {
  type EventSink,
  type QueuedActivation,
  type QueuedTargettedActivation,
  type TurnProcessor,
  executeTargettedActivation,
  normalizedRandom,
  randomOneOf,
} from '@potato-golem/core'
import type { BoardSupportedEvents } from '../../scenes/board/BoardScene'
import type { ActivationContextCardOrEvent } from '../activations/common/ActivationContext'
import type { EventDefinition, EventDefinitions, EventId } from '../definitions/eventDefinitions'

export class EventDirector implements TurnProcessor {
  private readonly eventsPlayed: Partial<Record<EventId, number>> = {}
  private readonly eventDefinitions: EventDefinitions
  private readonly eventSink: EventSink<BoardSupportedEvents>

  private readonly queuedActivations: Array<{
    activation: QueuedTargettedActivation<ActivationContextCardOrEvent>
    context: ActivationContextCardOrEvent
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

  addQueuedActivation(
    activation: QueuedTargettedActivation<ActivationContextCardOrEvent>,
    context: ActivationContextCardOrEvent,
  ) {
    if (activation.unique) {
      if (this.queuedActivations.some((entry) => entry.activation.id === activation.id)) {
        return
      }
    }

    this.queuedActivations.push({
      activation,
      context,
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
    const activationsToProcess = [...this.queuedActivations]
    let counter = 0
    for (const queuedActivation of activationsToProcess) {
      const isReady = queuedActivation.activation.processTime(1)
      if (isReady) {
        await queuedActivation.activation.activateTargettedAsync(queuedActivation.context)
        this.queuedActivations.splice(counter, 1)
      }
      counter++
    }
  }

  private async processRecurringActivations(): Promise<void> {
    for (const activation of this.recurringActivations) {
      const isReady = activation.processTime(1)
      if (isReady) {
        await activation.activateAsync()
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
      for (const effect of eventToPlay.effect) {
        await executeTargettedActivation(effect, {
          fromEvent: eventToPlay,
        })
      }
    }
    this.resetCounter()
  }

  resolveEligibleEvents(): readonly EventDefinition[] {
    return Object.values(this.eventDefinitions).filter((entry: EventDefinition) => {
      return entry.playableByDirector
    })
  }
}
