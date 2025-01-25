import { removeFromArrayById } from '@potato-golem/core'
import type { UnitEntityModel } from './UnitEntityModel'
import { UnitView } from '../../scenes/board/views/UnitView'

export class WorldModel {
  public readonly allUnits: UnitEntityModel[] = []
  public selectedUnit?: UnitView

  addUnit(cardModel: UnitEntityModel) {
    this.allUnits.push(cardModel)
  }

  selectUnit(selectedUnit: UnitView) {
    this.selectedUnit?.disableHighlight()
    this.selectedUnit = selectedUnit
    this.selectedUnit.enableHighlight()
  }

  unselectUnit() {
    this.selectedUnit?.disableHighlight()
    this.selectedUnit = undefined
  }

  /**
   * Remove entity by unique id
   */
  removeUnit(entityModelId: string): UnitEntityModel {
    return removeFromArrayById(this.allUnits, entityModelId)
  }
}
