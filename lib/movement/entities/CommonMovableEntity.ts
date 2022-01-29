import {DrawnEntity} from "./DrawnEntity";
import {MovableEntity} from "./MovableEntity";

export class CommonMovableEntity implements DrawnEntity, MovableEntity {
    public image: Phaser.GameObjects.Image;
    public x: number;
    public y: number;

    constructor(image: Phaser.GameObjects.Image) {
        this.image = image
        this.x = 0
        this.y = 0
    }

    move(deltaX: number, deltaY: number) {
        this.x += deltaX
        this.y += deltaY

        this.image.x += deltaX
        this.image.y += deltaY
    }

    moveTo(x: number, y: number) {
        this.x = x
        this.y = y

        this.image.x = x
        this.image.y = y
    }
}
