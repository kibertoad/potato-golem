import { type Coords, calculateManhattanDistance } from '@potato-golem/core'
import type { Dependencies } from '../../../model/diConfig'
import type { WorldModel } from '../../../model/entities/WorldModel'
import type { UnitView } from '../views/UnitView'

export class MovementProcessor {
  private readonly worldModel: WorldModel

  constructor({ worldModel }: Dependencies) {
    this.worldModel = worldModel
  }

  /**
   * Returns true if turn is over
   */
  tryToAttackUnit(attackingUnit: UnitView, targetUnit: UnitView): boolean {
    if (!attackingUnit) {
      console.log('unit is not selected')
      return false
    }

    const newValue = attackingUnit.model.powerValue.value + targetUnit.model.powerValue.value

    // If new value exceeds 13, both units die
    if (newValue > 13) {
      this.worldModel.removeUnit(attackingUnit)
      this.worldModel.removeUnit(targetUnit)
      this.worldModel.unselectUnit()
      return true
    }

    // attacker is stronger
    if (attackingUnit.model.powerValue.value >= targetUnit.model.powerValue.value) {
      console.log('Attacker won')
      this.worldModel.removeUnit(targetUnit)
      attackingUnit.increasePowerValue(targetUnit.model.powerValue.value)
      this.tryMoveToTile(attackingUnit, targetUnit.model.coords)
    }
    // defender is stronger
    else {
      console.log('Defender won')
      this.worldModel.removeUnit(attackingUnit)
      targetUnit.increasePowerValue(attackingUnit.model.powerValue.value)
    }
    this.worldModel.unselectUnit()
    return true
  }

  tryMoveToTile(selectedUnit: UnitView, targetMapCoords: Coords) {
    if (!selectedUnit) {
      console.log('unit is not selected')
      return false
    }

    if (calculateManhattanDistance(selectedUnit.model.coords, targetMapCoords) > 1) {
      console.log('too far')
      return false
    }

    // is tile busy?
    if (this.worldModel.unitMap.getByCoords(targetMapCoords)) {
      console.log('tile busy')
      return false
    }

    this.worldModel.moveUnit(selectedUnit, targetMapCoords)
    this.worldModel.unselectUnit()
    return true
  }
}
