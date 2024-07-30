import type { TargettedPrecondition } from '@potato-golem/core'
import type { CardModel } from '../../entities/CardModel'
import type { Zone } from '../../registries/zoneRegistry'

export class CombinedZonePrecondition implements TargettedPrecondition<CardModel> {
  private readonly zones: Zone[]

  constructor(zones: Zone | Zone[]) {
    this.zones = Array.isArray(zones) ? zones : [zones]
  }

  isSatisfied(targetCard: CardModel): boolean {
    if (!targetCard.combinedCard) {
      return false
    }

    return this.zones.includes('any') || this.zones.includes(targetCard.combinedCard.zone)
  }
}
