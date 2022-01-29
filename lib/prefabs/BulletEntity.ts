import {MovableEntity} from "../movement/entities/MovableEntity";
import {DrawnEntity} from "../movement/entities/DrawnEntity";
import {Entity} from "../movement/entities/Entity";
import {CommonMovableEntity} from "../movement/entities/CommonMovableEntity";
import {CommonEntityDescriptor, CommonEntityInstanceContext} from "../spawners/Spawner";

export type BulletEntityContext = {
    direction: number
    faction: string
} & CommonEntityInstanceContext

export class BulletDescriptor implements CommonEntityDescriptor<BulletEntityContext>{
    image: string;
    name: string;
    typeId: string;

    constructor(typeId: string, image: string, name: string) {
        this.typeId = typeId;
        this.image = image;
        this.name = name;
    }

    createInstance (descriptor: BulletDescriptor, context: BulletEntityContext): BulletEntity<BulletDescriptor> {
        const image = context.scene.add.image(context.x, context.y, descriptor.image)
        const bullet = new BulletEntity(this, image)
        return bullet
    }
}

export class BulletEntity<T extends BulletDescriptor> extends CommonMovableEntity<T> implements MovableEntity, DrawnEntity, Entity<T> {

}
