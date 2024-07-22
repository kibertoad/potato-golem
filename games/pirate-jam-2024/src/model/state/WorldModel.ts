import { removeFromArrayById } from '@potato-golem/core'
import { AlchemistModel } from '../entities/AlchemistModel'
import type { CardModel } from '../entities/CardModel'
import { HomunculusModel } from '../entities/HomunculusModel'

export class WorldModel {
  public readonly cards: CardModel[] = []
  public readonly homunculusModel: HomunculusModel
  public readonly alchemistModel: AlchemistModel

  constructor() {
    this.homunculusModel = new HomunculusModel()
    this.alchemistModel = new AlchemistModel()
  }

  addCard(cardModel: CardModel) {
    this.cards.push(cardModel)
  }

  removeCard(cardModelId: string): CardModel {
    return removeFromArrayById(this.cards, cardModelId)
  }
}
