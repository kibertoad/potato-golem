export type Coords = {
  x: number
  y: number
}

export function copyCoords (fromCoords: Coords, toCoords: Coords): void {
  toCoords.x = fromCoords.x
  toCoords.y = fromCoords.y
}
