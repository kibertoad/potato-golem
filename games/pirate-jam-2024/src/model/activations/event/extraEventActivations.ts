import {
  type EventSink,
  LOW_PRIORITY,
  type Precondition,
  type StaticDescriptionHolder,
} from '@potato-golem/core'
import type { Activation } from '@potato-golem/core'
import type { SpawnAnimation } from '../../../scenes/board/views/CardView'
import { delay } from '../../../utils/timeUtils'
import { cardDefinitions } from '../../definitions/cardDefinitions'
import type { CardModel } from '../../entities/CardModel'
import type { CardId } from '../../registries/cardRegistry'
import type { Zone } from '../../registries/zoneRegistry'
import type { CardActivation } from '../card/CardActivation'
import type { SpawnCardEventId } from './eventActivations'

export type SpawnActivationLocation = 'zone' | 'same_as_target' | 'same_as_combined'

export type SpawnCardMessage = {
  cardId: CardId
  zone: Zone
  spawnAnimation?: SpawnAnimation
  description: string
  amount?: number
  sourceCard?: CardModel
  precondition?: Precondition
}

export class SpawnCardActivation implements Activation, CardActivation, StaticDescriptionHolder {
  priority: number = LOW_PRIORITY

  private readonly cardId: CardId
  private zone: Zone
  private readonly spawnAnimation?: SpawnAnimation
  private readonly eventSink: EventSink<typeof SpawnCardEventId>
  readonly description: string
  private readonly amount: number
  private readonly customDelay: number
  private readonly precondition?: Precondition
  private readonly ignoreTargetCard: boolean

  //Allows to dynamically set the spawn zzone based on the card location
  private readonly spawnLocation: SpawnActivationLocation

  constructor(
    worldEventSink: EventSink<typeof SpawnCardEventId>,
    params: SpawnCardMessage,
    customDelay = -1,
    spawnLocation: SpawnActivationLocation = 'zone',
    ignoreTargetCard = false,
  ) {
    this.eventSink = worldEventSink
    this.cardId = params.cardId
    this.zone = params.zone
    this.spawnAnimation = params.spawnAnimation
    this.description = params.description
    this.amount = params.amount ?? 1
    this.customDelay = customDelay
    this.precondition = params.precondition
    this.spawnLocation = spawnLocation
    this.ignoreTargetCard = ignoreTargetCard
  }

  async activate(targetCard?: CardModel) {
    if (!this.precondition || this.precondition.isSatisfied()) {
      if (this.spawnLocation === 'same_as_target' && targetCard) {
        this.zone = targetCard.zone
      }
      if (this.spawnLocation === 'same_as_combined' && targetCard?.combinedCard) {
        this.zone = targetCard.combinedCard.zone
      }

      this.eventSink.emit('spawn_card', {
        cardId: this.cardId,
        sourceCard: this.ignoreTargetCard ? undefined : targetCard,
        zone: this.zone,
        spawnAnimation: this.spawnAnimation,
        description: this.description,
        amount: this.amount,
      } satisfies SpawnCardMessage)
      await delay(this.customDelay >= 0 ? this.customDelay : 200)
    }
  }

  getDescription(): string {
    return `Get 1 ${cardDefinitions[this.cardId].name}`
  }
}
