import { WorldModel } from '../../../model/entities/WorldModel'
import { Dependencies } from '../../../model/diConfig'

export class AIProcessor {
  private readonly worldModel: WorldModel

  constructor({ worldModel }: Dependencies) {
    this.worldModel = worldModel
  }

  processTurn() {
    console.log('next turn')
  }
}
