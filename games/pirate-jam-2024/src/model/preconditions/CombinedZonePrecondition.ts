import type { TargettedReasonedPrecondition } from '../../../../../packages/core/src/core/preconditions/Precondition'
import type { CardModel } from '../entities/CardModel'
import type { Zone } from '../registries/zoneRegistry'

/**
 * Can only be applied in a specified zone
 */
export class CombinedZonePrecondition implements TargettedReasonedPrecondition<CardModel> {
  private readonly zones: Zone[]
  private readonly notSatisfiedReason: string

  constructor(zones: Zone | Zone[], notSatisfiedReason?: string) {
    this.zones = Array.isArray(zones) ? zones : [zones]
    this.notSatisfiedReason = notSatisfiedReason
  }

  isSatisfied(targetCard: CardModel): true | string {
    if (!targetCard.combinedCard) {
      return ''
    }

    if (this.zones.includes('any') || this.zones.includes(targetCard.combinedCard.zone)) {
      return true
    }

    return this.notSatisfiedReason
  }
}
