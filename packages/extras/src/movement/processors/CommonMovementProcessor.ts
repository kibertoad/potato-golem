import type { Entity } from '../entities/Entity'
import type { MovableEntity } from '../entities/MovableEntity'

export type MovementProcessor = {
  moveEntity(entity: MovableEntity, deltaX: number, deltaY: number): void
}

export class CommonMovementProcessor implements MovementProcessor {
  moveEntity<T>(entity: MovableEntity & Entity<T>, deltaX: number, deltaY: number) {
    console.log(`Moving entity ${entity.name} by ${deltaX}/${deltaY}`)
    entity.move(deltaX, deltaY)
  }
}
