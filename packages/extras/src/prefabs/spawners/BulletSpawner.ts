import { Spawner } from '../../spawners/Spawner'
import type { BulletDescriptor, BulletEntity, BulletEntityContext } from '../entities/BulletEntity'

export class BulletSpawner extends Spawner<
  BulletDescriptor,
  BulletEntity<BulletDescriptor>,
  BulletEntityContext
> {}
