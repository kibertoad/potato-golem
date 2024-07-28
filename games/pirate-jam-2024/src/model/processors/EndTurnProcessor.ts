import type { TurnProcessor } from '@potato-golem/core'
import type { Dependencies } from '../diConfig'
import type { WorldModel } from '../state/WorldModel'

export class EndTurnProcessor implements TurnProcessor {
  private readonly worldModel: WorldModel

  constructor({ worldModel }: Dependencies) {
    this.worldModel = worldModel
  }

  async processTurn(): Promise<void> {
    console.log('Next turn')

    //Only process cards that existed before the turn ended
    const currentCards = [...this.worldModel.cards]
    for (const card of currentCards) {
      await card.processTurn()
    }
  }
}
