import type { Activation, EventSink } from '@potato-golem/core'
import { EventEmitters } from '../../registries/eventEmitterRegistry'

export type EventEventId = (typeof EVENT_EVENTS)[keyof typeof EVENT_EVENTS]
export const SpawnCardEventId: EventEventId = 'spawn_card'

export const EVENT_EVENTS = {
  CONCLUDE_EVENT: 'conclude_event',
  SPAWN_CARD: 'spawn_card',
  NEXT_EVENT: 'next_event',
} as const

export abstract class EventActivation implements Activation {
  protected readonly eventSink: EventSink<EventEventId>
  constructor(worldEventSink: EventSink<EventEventId>) {
    this.eventSink = worldEventSink
  }

  abstract activate()
}

export class ConcludeEventActivation extends EventActivation {
  override activate() {
    this.eventSink.emit('conclude_event', null)
  }
}

export class NextEventActivation extends EventActivation {
  private readonly nextEventId: string
  constructor(nextEventId: string) {
    super(EventEmitters.eventViewEmitter)
    this.nextEventId = nextEventId
  }

  override activate() {
    this.eventSink.emit('next_event', this.nextEventId)
  }
}
