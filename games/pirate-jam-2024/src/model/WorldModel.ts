import type { CardModel } from './CardModel'

export class WorldModel {
  private readonly cards: CardModel[] = []

  addCard(cardModel: CardModel) {
    this.cards.push(cardModel)
  }

}
