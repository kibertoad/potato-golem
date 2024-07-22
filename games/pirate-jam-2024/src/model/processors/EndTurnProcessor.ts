import type { TurnProcessor } from '@potato-golem/core'
import type { Dependencies } from '../diConfig'
import type { WorldModel } from '../state/WorldModel'

export class EndTurnProcessor implements TurnProcessor {
  private readonly worldModel: WorldModel

  constructor({ worldModel }: Dependencies) {
    this.worldModel = worldModel
  }

  processTurn(): void {
    console.log('Next turn')
    for (const card of this.worldModel.cards) {
      card.processTurn()
    }
  }
}
