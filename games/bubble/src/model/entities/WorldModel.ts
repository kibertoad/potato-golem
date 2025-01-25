import { removeFromArrayById } from '@potato-golem/core'
import type { UnitEntity } from './UnitEntity'

export class WorldModel {
  public readonly allUnits: UnitEntity[] = []

  addUnit(cardModel: UnitEntity) {
    this.allUnits.push(cardModel)
  }

  /**
   * Remove entity by unique id
   */
  removeUnit(entityModelId: string): UnitEntity {
    return removeFromArrayById(this.allUnits, entityModelId)
  }
}
