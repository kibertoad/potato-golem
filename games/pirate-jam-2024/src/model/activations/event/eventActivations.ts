import type { EventSink, TargettedActivation } from '@potato-golem/core'
import type { CardId } from '../../definitions/cardDefinitions'
import type { EventDefinition } from '../../definitions/eventDefinitions'
import type { Zone } from '../../registries/zoneRegistry'

export type EventEventId = (typeof EVENT_EVENTS)[keyof typeof EVENT_EVENTS]

export type SpawnCardMessage = {
  cardId: CardId
  zone: Zone
}

export const EVENT_EVENTS = {
  CONCLUDE_EVENT: 'conclude_event',
  SPAWN_CARD: 'spawn_card',
} as const

export abstract class EventActivation implements TargettedActivation<EventDefinition> {
  protected readonly eventSink: EventSink<EventEventId>
  constructor(worldEventSink: EventSink<EventEventId>) {
    this.eventSink = worldEventSink
  }

  abstract activate(event: EventDefinition)
}

export class ConcludeEventActivation extends EventActivation {
  activate(_event: EventDefinition) {
    this.eventSink.emit('conclude_event', null)
  }
}
