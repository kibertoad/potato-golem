import { removeFromArrayById } from '@potato-golem/core'
import type { CardModel } from './CardModel'

export class WorldModel {
  public readonly cards: CardModel[] = []

  addCard(cardModel: CardModel) {
    this.cards.push(cardModel)
  }

  removeCard(cardModelId: string): CardModel {
    return removeFromArrayById(this.cards, cardModelId)
  }
}
