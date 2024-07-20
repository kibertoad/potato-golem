import { LOW_PRIORITY } from '@potato-golem/core'
import type { CardModel } from '../CardModel'
import type { CardActivation } from './CardActivation'

export class DecomposeCardActivation implements CardActivation {
  isExclusive = true
  priority = LOW_PRIORITY

  activate(targetCard: CardModel) {
    targetCard.destroy()
  }
}
