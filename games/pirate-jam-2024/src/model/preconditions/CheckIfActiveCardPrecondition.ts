import type { TargettedReasonedPrecondition } from '../../../../../packages/core/src/core/preconditions/Precondition'
import type { CardModel } from '../entities/CardModel'

export class CheckIfActiveCardPrecondition implements TargettedReasonedPrecondition<CardModel> {
  private readonly active: boolean
  private readonly notSatisfiedReason?: string

  constructor(active: boolean, notSatisfiedReason?: string) {
    this.active = active
    this.notSatisfiedReason = notSatisfiedReason
  }

  isSatisfied(targetCard: CardModel): boolean | string {
    console.log('Precondition', targetCard.view.isActiveCard(), this.active)
    return targetCard.view.isActiveCard() === this.active || this.notSatisfiedReason || false
  }
}
