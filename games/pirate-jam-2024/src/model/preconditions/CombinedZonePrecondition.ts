import type { TargettedReasonedPrecondition } from '../../../../../packages/core/src/core/preconditions/Precondition'
import type { Zone } from '../registries/zoneRegistry'
import type { ActivationContextSingleCard } from '../activations/common/ActivationContext'

/**
 * Can only be applied in a specified zone
 */
export class CombinedZonePrecondition implements TargettedReasonedPrecondition<ActivationContextSingleCard> {
  private readonly zones: Zone[]
  private readonly notSatisfiedReason: string

  constructor(zones: Zone | Zone[], notSatisfiedReason?: string) {
    this.zones = Array.isArray(zones) ? zones : [zones]
    this.notSatisfiedReason = notSatisfiedReason
  }

  isSatisfiedForTarget(context: ActivationContextSingleCard): true | string {
    if (!context.targetCard.combinedCard) {
      return ''
    }

    if (this.zones.includes('any') || this.zones.includes(context.targetCard.combinedCard.zone)) {
      return true
    }

    return this.notSatisfiedReason
  }
}
