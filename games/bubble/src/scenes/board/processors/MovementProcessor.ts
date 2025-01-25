import { type Coords, calculateManhattanDistance } from '@potato-golem/core'
import type { Dependencies } from '../../../model/diConfig'
import type { WorldModel } from '../../../model/entities/WorldModel'
import type { UnitView } from '../views/UnitView'

export class MovementProcessor {
  private readonly worldModel: WorldModel

  constructor({ worldModel }: Dependencies) {
    this.worldModel = worldModel
  }

  tryToAttackUnit(attackingUnit: UnitView, targetUnit: UnitView) {
    if (!attackingUnit) {
      console.log('unit is not selected')
      return
    }

    this.worldModel.removeUnit(targetUnit)

    this.tryMoveToTile(attackingUnit, targetUnit.model.coords)
  }

  tryMoveToTile(selectedUnit: UnitView, targetMapCoords: Coords) {
    if (!selectedUnit) {
      console.log('unit is not selected')
      return
    }

    if (calculateManhattanDistance(selectedUnit.model.coords, targetMapCoords) > 1) {
      console.log('too far')
      return
    }

    // is tile busy?
    if (this.worldModel.unitMap.getByCoords(targetMapCoords)) {
      console.log('tile busy')
      return
    }

    this.worldModel.moveUnit(selectedUnit, targetMapCoords)
  }
}
