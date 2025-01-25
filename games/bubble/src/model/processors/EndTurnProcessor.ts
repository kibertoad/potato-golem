import type { TurnProcessor } from '@potato-golem/core'
import type { Dependencies } from '../diConfig'
import type { WorldModel } from '../entities/WorldModel'

export class EndTurnProcessor implements TurnProcessor {
  private readonly worldModel: WorldModel

  constructor({ worldModel }: Dependencies) {
    this.worldModel = worldModel
  }

  processTurn(): void {
    console.log('Next turn')
  }
}
