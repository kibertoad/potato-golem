import { removeFromArrayById } from '@potato-golem/core'
import  type { CardModel } from '../entities/CardModel'
import type { HomunculusModel } from '../entities/HomunculusModel'

export class WorldModel {
  public readonly cards: CardModel[] = []
  public readonly homunculusModel: HomunculusModel

  constructor(homunculusModel: HomunculusModel) {
    this.homunculusModel = homunculusModel
  }

  addCard(cardModel: CardModel) {
    this.cards.push(cardModel)
  }

  removeCard(cardModelId: string): CardModel {
    return removeFromArrayById(this.cards, cardModelId)
  }
}
