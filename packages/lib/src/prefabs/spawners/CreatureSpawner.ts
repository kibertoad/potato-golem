import {
  CommonEntityDescriptor,
  CommonEntityInstanceContext,
  Spawner,
} from '../../spawners/Spawner'
import { BulletDescriptor, BulletEntity, BulletEntityContext } from '../entities/BulletEntity'
import { CommonMovableEntity } from '../../movement/entities/CommonMovableEntity'

export class CreatureSpawner extends Spawner<
  CommonEntityDescriptor<CommonEntityInstanceContext>,
  CommonMovableEntity,
  CommonEntityInstanceContext
> {}
