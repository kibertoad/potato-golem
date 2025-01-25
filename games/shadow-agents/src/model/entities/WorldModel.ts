import { removeFromArrayById } from '@potato-golem/core'
import type { EntityModel } from './EntityModel'

export class WorldModel {
  public readonly entities: EntityModel[] = []

  addEntity(cardModel: EntityModel) {
    this.entities.push(cardModel)
  }

  /**
   * Remove entity by unique id
   */
  removeEntity(entityModelId: string): EntityModel {
    return removeFromArrayById(this.entities, entityModelId)
  }
}
