import type { EventSink } from '@potato-golem/core'
import type { SpawnAnimation } from '../../../scenes/board/views/CardView'
import type { CardId } from '../../registries/cardRegistry'
import type { Zone } from '../../registries/zoneRegistry'
import { EventActivation, type EventEventId, type SpawnCardMessage } from './eventActivations'

export class SpawnCardActivation extends EventActivation {
  private readonly cardId: CardId
  private readonly zone: Zone
  private readonly spawnAnimation?: SpawnAnimation

  constructor(worldEventSink: EventSink<EventEventId>, params: SpawnCardMessage) {
    super(worldEventSink)
    this.cardId = params.cardId
    this.zone = params.zone
    this.spawnAnimation = params.spawnAnimation
  }

  override activate() {
    this.eventSink.emit('spawn_card', {
      cardId: this.cardId,
      zone: this.zone,
      spawnAnimation: this.spawnAnimation,
    } satisfies SpawnCardMessage)
  }
}
