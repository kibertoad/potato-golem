import type { TargettedReasonedPrecondition } from '../../../../../packages/core/src/core/preconditions/Precondition'
import type { CardModel } from '../entities/CardModel'
import { ActivationContext, ActivationContextCard } from '../activations/common/ActivationContext'

export class CheckIfActiveCardPrecondition implements TargettedReasonedPrecondition<ActivationContext> {
  private readonly active: boolean
  private readonly notSatisfiedReason: string

  constructor(active: boolean, notSatisfiedReason: string) {
    this.active = active
    this.notSatisfiedReason = notSatisfiedReason
  }

  isSatisfied(context: ActivationContextCard): true | string {
    console.log('Precondition', context.sourceCard.view.isActiveCard(), this.active)
    return context.sourceCard.view.isActiveCard() === this.active || this.notSatisfiedReason
  }
}
