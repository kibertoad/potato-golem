import { Activation } from '@potato-golem/core'
import { AiOperationPlanner } from '../ai/AiOperationPlanner'
import { worldState } from '../model/worldState'
export class EndTurnProcessor implements Activation {
  private readonly aiOperationPlanner: AiOperationPlanner

  constructor() {
    this.aiOperationPlanner = new AiOperationPlanner(worldState)
  }

  activate(): void {
    this.aiOperationPlanner.activate()
  }

  public static build() {
    const activation = new EndTurnProcessor()
    return () => {
      console.log('Activate end turn')
      activation.activate()
    }
  }

}