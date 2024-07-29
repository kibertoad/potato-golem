import { removeFromArrayById } from '@potato-golem/core'
import type Phaser from 'phaser'
import type { ZoneView } from '../../scenes/board/views/ZoneView'
import { AlchemistModel } from '../entities/AlchemistModel'
import type { CardModel } from '../entities/CardModel'
import { HomunculusModel } from '../entities/HomunculusModel'
import type { CardId } from '../registries/cardRegistry'
import type { Zone } from '../registries/zoneRegistry'

export class WorldModel {
  public readonly cards: CardModel[] = []
  public readonly zones: Partial<Record<Zone, ZoneView>> = {}
  public readonly homunculusModel: HomunculusModel
  public readonly alchemistModel: AlchemistModel
  public theLawIsDead = false
  public musicScene: Phaser.Scene

  constructor() {
    this.homunculusModel = new HomunculusModel()
    this.alchemistModel = new AlchemistModel()
  }

  addCard(cardModel: CardModel) {
    this.cards.push(cardModel)
  }

  removeCard(cardModelId: string): CardModel {
    for (const zoneId of Object.keys(this.zones)) {
      this.removeCardFromZone(zoneId as Zone, cardModelId)
    }
    return removeFromArrayById(this.cards, cardModelId)
  }

  removeCardFromZone(zoneId: Zone, cardModelId: string) {
    this.zones[zoneId].removeCardByUUID(cardModelId)
  }

  searchForCards(cardIds: CardId | CardId[], zone: Zone = 'any'): CardModel | undefined {
    cardIds = Array.isArray(cardIds) ? cardIds : [cardIds]
    let card: CardModel
    for (let i = worldModel.cards.length - 1; i >= 0; i--) {
      card = worldModel.cards[i]
      if ((zone === 'any' || card.zone === zone) && cardIds.includes(card.definition.id)) {
        return card
      }
    }
  }

  hasCard(cardId: CardId) {
    for (const zone of Object.values(this.zones)) {
      const hasCard = zone.hasCard(cardId)
      if (hasCard) {
        return true
      }
    }

    return false
  }
}

export const worldModel = new WorldModel()
