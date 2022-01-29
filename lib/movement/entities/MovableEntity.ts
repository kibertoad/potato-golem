export interface MovableEntity {
    x: number
    y: number

    move(deltaX: number, deltaY: number)
}
