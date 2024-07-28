import { type EventSink, LOW_PRIORITY, type StaticDescriptionHolder } from '@potato-golem/core'
import type { Activation } from '@potato-golem/core'
import type { SpawnAnimation } from '../../../scenes/board/views/CardView'
import { delay } from '../../../utils/timeUtils'
import { cardDefinitions } from '../../definitions/cardDefinitions'
import type { CardModel } from '../../entities/CardModel'
import type { CardId } from '../../registries/cardRegistry'
import type { Zone } from '../../registries/zoneRegistry'
import type { CardActivation } from '../card/CardActivation'
import type { SpawnCardEventId } from './eventActivations'

export type SpawnCardMessage = {
  cardId: CardId
  zone: Zone
  spawnAnimation?: SpawnAnimation
  description: string
  amount?: number
  sourceCard?: CardModel
}

export class SpawnCardActivation implements Activation, CardActivation, StaticDescriptionHolder {
  priority: number = LOW_PRIORITY

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

  async activate(targetCard?: CardModel) {
    this.eventSink.emit('spawn_card', {
      cardId: this.cardId,
      sourceCard: targetCard,
      zone: this.zone,
      spawnAnimation: this.spawnAnimation,
      description: this.description,
      amount: this.amount,
    } satisfies SpawnCardMessage)
    await delay(200)
  }

  getDescription(): string {
    return `Get 1 ${cardDefinitions[this.cardId].name}`
  }
}
