import { idsToTerritories, Side, TerritoriesStateType, TerritoryState } from '../model/worldState'
import { idsToTerritoryDefinitions } from '../model/territories'

export class TerritoryCalculator {
  private territoriesState: TerritoriesStateType

  constructor(territoriesState: TerritoriesStateType) {
    this.territoriesState = territoriesState
  }

  getBorderingTerritories(forOwningSide: Side, minOwnerBorderControl: number, maxOwnerTerritoryControl: number) {
    const qualifyingOwnerTerritories = Object.values(this.territoriesState).filter((territory) => {
      return territory.control[forOwningSide].value >= minOwnerBorderControl
    })

    const qualifyingBorderTerritories = qualifyingOwnerTerritories.map((territory) => {
      return territory.definition.connectedTo
    }).flat()
    const qualifyingBorderTerritoriesUnique = new Set(qualifyingBorderTerritories)

    const qualifyingTerritories = idsToTerritories(qualifyingBorderTerritoriesUnique)

    const result = qualifyingTerritories.filter((territory) => {
      return territory.control[forOwningSide].value <= maxOwnerTerritoryControl
    })

    console.log(`Eligible territories: ${JSON.stringify(result)}`)

    return result
  }
}