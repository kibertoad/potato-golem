export type Coords = {
  x: number
  y: number
}

export type Dimensions = {
  width: number
  height: number
}

export function copyCoords(fromCoords: Coords, toCoords: Coords): void {
  toCoords.x = fromCoords.x
  toCoords.y = fromCoords.y
}
