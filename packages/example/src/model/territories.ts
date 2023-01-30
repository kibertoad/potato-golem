export type TerritoryDefinition = {
  id: TerritoryIds
  name: string
  sizeX: number
  sizeY: number
  positionX: number
  positionY: number
}

export enum TerritoryIds {
  RED_LEAF = 'redLeaf',
WHITE_HILLS = 'whiteHills'
}

export const territories: Record<TerritoryIds, TerritoryDefinition> = {
  redLeaf: {
    id: TerritoryIds.RED_LEAF,
    name: 'Red Leaf',
    sizeX: 50,
    sizeY: 50,
    positionX: 50,
    positionY: 50,
  },

  [TerritoryIds.WHITE_HILLS]: {
    id: TerritoryIds.WHITE_HILLS,
    name: 'White Hills',
    sizeX: 50,
    sizeY: 50,
    positionX: 250,
    positionY: 50,
  },

}