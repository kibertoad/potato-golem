import { removeFromArrayById } from '@potato-golem/core'
import type { ChoiceModel } from './ChoiceModel'

export class WorldModel {
  public readonly choices: ChoiceModel[] = []

  addChoice(cardModel: ChoiceModel) {
    this.choices.push(cardModel)
  }

  /**
   * Remove entity by unique id
   */
  removeEntity(entityModelId: string): ChoiceModel {
    return removeFromArrayById(this.choices, entityModelId)
  }
}
