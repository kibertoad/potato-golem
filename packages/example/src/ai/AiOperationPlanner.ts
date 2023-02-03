import { WorldState } from '../model/worldState'
import { Activation } from '@potato-golem/extras'
import { AiReconPlanner } from './AiReconPlanner'
import { LimitedNumber } from '@potato-golem/core'

const expectedCapacityUtilizationPercentage = 80

export class AiOperationPlanner implements Activation {

  /**
   * Total sum of operational complexity points that AI can utilize at the same time
   */
  operationCapacity: LimitedNumber

  readonly #worldState: WorldState
  private aiReconPlanner: AiReconPlanner
  constructor(worldState: WorldState) {
    this.#worldState = worldState

    this.operationCapacity = new LimitedNumber(0, 20)
    this.aiReconPlanner = new AiReconPlanner(worldState)
  }

  activate(): void {
    if (this.operationCapacity.getPercentage() >= expectedCapacityUtilizationPercentage) {
      console.log('Sufficient amount of operations are already running, do nothing')
      return
    }

    const newOperation = this.aiReconPlanner.planOperations(this.operationCapacity.getMissing())
    if (!newOperation) {
      return
    }
    this.operationCapacity.increase(newOperation.operationalCost)
  }

}