import {CommonEntityDescriptor, CommonEntityInstanceContext, Spawner} from "../Spawner";
import {BulletDescriptor, BulletEntity, BulletEntityContext} from "../../prefabs/BulletEntity";
import {CommonMovableEntity} from "../../movement/entities/CommonMovableEntity";

export class CreatureSpawner extends Spawner<CommonEntityDescriptor<CommonEntityInstanceContext>, CommonMovableEntity, CommonEntityInstanceContext> {
}
