export interface MovableEntity {
  x: number
  y: number
  name: string

  move(deltaX: number, deltaY: number): void
}
