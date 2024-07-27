import { removeFromArrayById } from '@potato-golem/core'
import type { ZoneView } from '../../scenes/board/views/ZoneView'
import { AlchemistModel } from '../entities/AlchemistModel'
import type { CardModel } from '../entities/CardModel'
import { HomunculusModel } from '../entities/HomunculusModel'

export class WorldModel {
  public readonly cards: CardModel[] = []
  public readonly zones: { string?: ZoneView } = {}
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
    for (const zoneView in this.zones) {
      this.removeCardFromZone(zoneView, cardModelId)
    }
    return removeFromArrayById(this.cards, cardModelId)
  }

  removeCardFromZone(zoneId: string, cardModelId: string) {
    this.zones[zoneId].removeCardById(cardModelId)
  }
}

export const worldModel = new WorldModel()
