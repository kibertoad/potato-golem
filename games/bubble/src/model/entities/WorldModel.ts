import { type Coords, removeFromArrayById, TwoDimensionalMap } from '@potato-golem/core'
import { UnitView } from '../../scenes/board/views/UnitView'

export class WorldModel {
  public readonly allUnits: UnitView[] = []
  public selectedUnit?: UnitView

  public readonly unitMap: TwoDimensionalMap<UnitView | null>

  constructor() {
    this.unitMap = new TwoDimensionalMap()
  }

  addUnit(cardView: UnitView) {
    this.allUnits.push(cardView)

    this.unitMap.setByCoords(cardView.model.coords, cardView)
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
  removeUnit(entityModelId: string): UnitView {
    const removedUnit = removeFromArrayById(this.allUnits, entityModelId)
    this.unitMap.setByCoords(removedUnit.model.coords, null)
    return removedUnit
  }

  moveUnit(selectedUnit: UnitView, targetMapCoords: Coords) {
    this.unitMap.setByCoords(selectedUnit.model.coords, null)
    selectedUnit.model.coords.x = targetMapCoords.x
    selectedUnit.model.coords.y = targetMapCoords.y
    selectedUnit.moveToTile(targetMapCoords)
    this.unitMap.setByCoords(selectedUnit.model.coords, selectedUnit)
    this.unselectUnit()
  }
}
