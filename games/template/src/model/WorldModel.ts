import { removeFromArrayById } from '@potato-golem/core'
import type { EntityModel } from './EntityModel'

export class WorldModel {
  public readonly cards: EntityModel[] = []

  addCard(cardModel: EntityModel) {
    this.cards.push(cardModel)
  }

  removeCard(cardModelId: string): EntityModel {
    return removeFromArrayById(this.cards, cardModelId)
  }
}
