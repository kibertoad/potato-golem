import type { EventSink } from '@potato-golem/core'
import type { CardId } from '../../registries/cardRegistry'
import type { Zone } from '../../registries/zoneRegistry'
import { EventActivation, type EventEventId, type SpawnCardMessage } from './eventActivations'

export class SpawnCardActivation extends EventActivation {
  private readonly cardId: CardId
  private readonly zone: Zone

  constructor(worldEventSink: EventSink<EventEventId>, params: SpawnCardMessage) {
    super(worldEventSink)
    this.cardId = params.cardId
    this.zone = params.zone
  }

  override activate() {
    this.eventSink.emit('spawn_card', {
      cardId: this.cardId,
      zone: this.zone,
    } satisfies SpawnCardMessage)
  }
}
