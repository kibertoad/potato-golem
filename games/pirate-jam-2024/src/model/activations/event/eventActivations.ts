import type { Activation, EventSink } from '@potato-golem/core'

export type EventEventId = (typeof EVENT_EVENTS)[keyof typeof EVENT_EVENTS]
export const SpawnCardEventId: EventEventId = 'spawn_card'

export const EVENT_EVENTS = {
  CONCLUDE_EVENT: 'conclude_event',
  SPAWN_CARD: 'spawn_card',
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
