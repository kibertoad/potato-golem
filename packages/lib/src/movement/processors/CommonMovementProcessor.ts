import { MovableEntity } from '../entities/MovableEntity'
import { Entity } from '../entities/Entity'

export type MovementProcessor = {
  moveEntity(entity: MovableEntity, deltaX: number, deltaY: number): void
}

export class CommonMovementProcessor implements MovementProcessor {
  moveEntity<T>(entity: MovableEntity & Entity<T>, deltaX: number, deltaY: number) {
    console.log(`Moving entity ${entity.name} by ${deltaX}/${deltaY}`)
    entity.move(deltaX, deltaY)
  }
}
