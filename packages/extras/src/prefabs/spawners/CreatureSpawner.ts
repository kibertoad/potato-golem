import type { CommonMovableEntity } from '../../movement/entities/CommonMovableEntity'
import {
  type CommonEntityDescriptor,
  type CommonEntityInstanceContext,
  Spawner,
} from '../../spawners/Spawner'
import { BulletDescriptor, BulletEntity, BulletEntityContext } from '../entities/BulletEntity'

export class CreatureSpawner extends Spawner<
  CommonEntityDescriptor<CommonEntityInstanceContext>,
  CommonMovableEntity,
  CommonEntityInstanceContext
> {}
