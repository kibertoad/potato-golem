import type { Activation, EventSink, StaticDescriptionHolder } from '@potato-golem/core'
import type { SpawnAnimation } from '../../../scenes/board/views/CardView'
import type { CardId } from '../../registries/cardRegistry'
import type { Zone } from '../../registries/zoneRegistry'
import type { SpawnCardEventId } from './eventActivations'

export type SpawnCardMessage = {
  cardId: CardId
  zone: Zone
  spawnAnimation?: SpawnAnimation
  description: string
  amount?: number
}

export class SpawnCardActivation implements Activation, StaticDescriptionHolder {
  private readonly cardId: CardId
  private readonly zone: Zone
  private readonly spawnAnimation?: SpawnAnimation
  private readonly eventSink: EventSink<typeof SpawnCardEventId>
  readonly description: string
  private readonly amount: number

  constructor(worldEventSink: EventSink<typeof SpawnCardEventId>, params: SpawnCardMessage) {
    this.eventSink = worldEventSink
    this.cardId = params.cardId
    this.zone = params.zone
    this.spawnAnimation = params.spawnAnimation
    this.description = params.description
    this.amount = params.amount ?? 1
  }

  activate() {
    this.eventSink.emit('spawn_card', {
      cardId: this.cardId,
      zone: this.zone,
      spawnAnimation: this.spawnAnimation,
      description: this.description,
      amount: this.amount
    } satisfies SpawnCardMessage)
  }
}
