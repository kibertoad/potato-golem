import Phaser = require('phaser')
import { Entity } from '../movement/entities/Entity'
import { CommonMovableEntity } from '../movement/entities/CommonMovableEntity'

export type CommonEntityInstanceContext = {
  scene: Phaser.Scene
  x: number
  y: number
}

export const commonCreateInstance = (
  descriptor: CommonEntityDescriptor<CommonEntityInstanceContext>,
  context: CommonEntityInstanceContext,
) => {
  console.log(`Creating instance of ${descriptor.name}`)
  const image = context.scene.add.image(context.x, context.y, descriptor.image)
  const entity = new CommonMovableEntity(descriptor, image)
  entity.moveTo(context.x, context.y)
  return entity
}

export type CommonEntityDescriptor<InstanceContext> = {
  typeId: string
  name: string
  image: string
  createInstance(descriptor: CommonEntityDescriptor<InstanceContext>, context: InstanceContext): any
}

export class Spawner<
  EntityDescriptor extends CommonEntityDescriptor<InstanceContext>,
  EntityInstance extends Entity<EntityDescriptor>,
  InstanceContext,
> {
  private idCounter: number
  private readonly entities: EntityInstance[]
  private readonly descriptorRegistry: Record<string, EntityDescriptor>

  public constructor(
    entityList: EntityInstance[],
    descriptorRegistry: Record<string, EntityDescriptor>,
  ) {
    this.entities = entityList
    this.descriptorRegistry = descriptorRegistry
    this.idCounter = 1
  }

  spawn(entityType: string, context: InstanceContext): EntityInstance {
    const descriptor = this.descriptorRegistry[entityType]
    if (!descriptor) {
      throw new Error(`Unknown entity: ${entityType}`)
    }

    const instance = descriptor.createInstance(descriptor, context)
    instance.id = this.idCounter
    this.idCounter++

    this.entities.push(instance)
    return instance
  }
}
