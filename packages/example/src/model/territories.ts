export type TerritoryDefinition = {
  id: TerritoryIds
  name: string
  sizeX: number
  sizeY: number
  positionX: number
  positionY: number
  connectedTo: readonly TerritoryIds[]
}

export enum TerritoryIds {
  RED_LEAF = 'redLeaf',
  WHITE_HILLS = 'whiteHills',
  OLD_FOREST = 'oldForest',
}

export function idsToTerritoryDefinitions(ids: Set<TerritoryIds>) {
  return Object.values(territories).filter((territory) => {
    return ids.has(territory.id)
  })
}

export const territories: Record<TerritoryIds, TerritoryDefinition> = {
  [TerritoryIds.OLD_FOREST]: {
    id: TerritoryIds.OLD_FOREST,
    name: 'Old Forest',
    sizeX: 50,
    sizeY: 50,
    positionX: 10,
    positionY: 50,
    connectedTo: [TerritoryIds.RED_LEAF]
  },

  [TerritoryIds.RED_LEAF]: {
    id: TerritoryIds.RED_LEAF,
    name: 'Red Leaf',
    sizeX: 50,
    sizeY: 50,
    positionX: 130,
    positionY: 50,
    connectedTo: [TerritoryIds.WHITE_HILLS, TerritoryIds.OLD_FOREST]
  },

  [TerritoryIds.WHITE_HILLS]: {
    id: TerritoryIds.WHITE_HILLS,
    name: 'White Hills',
    sizeX: 50,
    sizeY: 50,
    positionX: 470,
    positionY: 50,
    connectedTo: [TerritoryIds.RED_LEAF]
  },

}