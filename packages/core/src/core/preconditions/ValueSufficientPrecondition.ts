import type { LimitedNumber } from '../primitives/LimitedNumber'
import { PreconditionWithMetadata } from './PreconditionWithMetadata'

export class ValueSufficientPrecondition extends PreconditionWithMetadata {
  private readonly trackedValue: LimitedNumber
  private readonly targetValue: number

  /**
   *
   * @param relatedEntityId if not specified, trackedValue must have one
   */
  constructor(trackedValue: LimitedNumber, targetValue: number, relatedEntityId?: string) {
    const referenceId = relatedEntityId ?? trackedValue.referenceId
    if (!referenceId) {
      throw new Error('Either trackedValue.referenceId or relatedEntityId are mandatory')
    }

    super({
      relatedEntityId: referenceId,
    })
    this.trackedValue = trackedValue
    this.targetValue = targetValue
  }

  isSatisfied(): boolean {
    console.log(`${this.trackedValue.value} -> ${this.targetValue}`)
    return this.trackedValue.value >= this.targetValue
  }
}
