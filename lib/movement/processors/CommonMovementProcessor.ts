import {MovableEntity} from "../entities/MovableEntity";
import {Entity} from "../entities/Entity";

export type MovementProcessor = {
    moveEntity(entity: MovableEntity, deltaX: number, deltaY: number)
}

export class CommonMovementProcessor implements MovementProcessor{

    moveEntity(entity: MovableEntity & Entity, deltaX: number, deltaY: number) {
        console.log(`Moving entity ${entity.name} by ${deltaX}/${deltaY}`)
        entity.move(deltaX, deltaY)
    }
}
