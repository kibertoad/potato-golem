import { WorldModel } from '../../../model/entities/WorldModel'
import { calculateManhattanDistance, Coords } from '@potato-golem/core'
import { UnitView } from '../views/UnitView'
import { Dependencies } from '../../../model/diConfig'

export class MovementProcessor {
  private readonly worldModel: WorldModel

  constructor({ worldModel }: Dependencies) {
    this.worldModel = worldModel
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
