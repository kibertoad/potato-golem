import { WorldState } from '../model/worldState'
import { Activation } from '@potato-golem'

export class AiOperationPlanner implements Activation {
  readonly #worldState: WorldState
  constructor(worldState: WorldState) {
    this.#worldState = worldState
  }

  activate(): void {
  }

}