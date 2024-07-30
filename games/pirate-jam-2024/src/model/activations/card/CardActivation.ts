import type { TargettedActivation } from '@potato-golem/core'
import type { CardModel } from '../../entities/CardModel'

export abstract class CardActivation implements TargettedActivation<CardModel> {
  abstract activate(target: CardModel): void

  abstract getDescription(): string
}
