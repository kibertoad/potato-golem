import type { Prioritized, TargettedActivation } from '@potato-golem/core'
import type { CardModel } from '../CardModel'

export abstract class CardActivation implements Prioritized, TargettedActivation<CardModel> {
  abstract isExclusive?: boolean
  abstract priority: number

  abstract activate(target: CardModel): void
}
