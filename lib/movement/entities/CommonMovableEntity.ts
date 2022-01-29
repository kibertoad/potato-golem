import {DrawnEntity} from "./DrawnEntity";
import {MovableEntity} from "./MovableEntity";
import {Entity} from "./Entity";
import {CommonEntityDescriptor} from "../../spawners/Spawner";

export class CommonMovableEntity<T extends CommonEntityDescriptor<any> = CommonEntityDescriptor<any>> implements DrawnEntity, MovableEntity, Entity<T> {
    public image: Phaser.GameObjects.Image;
    public x: number;
    public y: number;
    public id: number;
    public descriptor: T;

    constructor(descriptor: T, image: Phaser.GameObjects.Image) {
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
