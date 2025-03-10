import type { Activation } from '@potato-golem/core'
import type { ImageId } from '../../registries/imageRegistry'
import type { StateDelta } from '../definitions/state/StateDefinition'
import { worldModel } from '../entities/WorldModel'

export type StoryConclusionActivationParams = {
  image: ImageId
  text: string
  stateChanges: StateDelta
}

export class StoryConclusionActivation implements Activation {
  private image: ImageId
  private text: string
  private stateChanges: StateDelta

  constructor(params: StoryConclusionActivationParams) {
    this.image = params.image,
    this.text = params.text
    this.stateChanges = params.stateChanges
  }

  activate(): void {
    worldModel.playerStateTracker.applyDelta(this.stateChanges)
  }

}
