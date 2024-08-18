import type { EventSink, TargettedActivation } from '@potato-golem/core'
import { EventEmitters } from '../../registries/eventEmitterRegistry'
import type { ActivationContextEvent } from '../common/ActivationContext'

export type EventEventId = (typeof EVENT_EVENTS)[keyof typeof EVENT_EVENTS]
export const SpawnCardEventId: EventEventId = 'spawn_card'

export const EVENT_EVENTS = {
  CONCLUDE_EVENT: 'conclude_event',
  SPAWN_CARD: 'spawn_card',
  NEXT_EVENT: 'next_event',
} as const

export abstract class EventActivation implements TargettedActivation<ActivationContextEvent> {
  protected readonly eventSink: EventSink<EventEventId>
  constructor() {
    this.eventSink = EventEmitters.eventViewEmitter
  }

  abstract activateTargetted(context: ActivationContextEvent): void
}

export class ConcludeEventActivation extends EventActivation {
  override activateTargetted() {
    this.eventSink.emit('conclude_event', null)
  }
}

export class NextEventActivation extends EventActivation {
  private readonly nextEventId: string
  constructor(nextEventId: string) {
    super()
    this.nextEventId = nextEventId
  }

  override activateTargetted() {
    this.eventSink.emit('next_event', this.nextEventId)
  }
}
