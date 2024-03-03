import { validateNotNil } from 'validation-utils'
import { CommonEntityDescriptor } from '../../spawners/Spawner'
import { DrawnEntity } from './DrawnEntity'
import { Entity } from './Entity'
import { MovableEntity } from './MovableEntity'

export let idCounter = 0

export class CommonMovableEntity<
  T extends CommonEntityDescriptor<any> = CommonEntityDescriptor<any>,
> implements DrawnEntity, MovableEntity, Entity<T>
{
  public image: Phaser.GameObjects.Image
  public x: number
  public y: number
  public id: number
  public name: string
  public descriptor: T

  constructor(descriptor: T, image: Phaser.GameObjects.Image) {
    this.image = image
    this.descriptor = descriptor
    this.x = 0
    this.y = 0
    this.name = descriptor.name
    this.id = ++idCounter
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

    this.image.setX(x)
    this.image.setY(y)
  }
}
