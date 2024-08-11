import {
  AVERAGE_PRIORITY,
  type TargettedActivation,
  type TargettedActivationCallback, type TargettedActivations,
  type TargettedAsyncActivation,
} from '../common/Activation'
import { ActivationContainer } from '../common/ActivationContainer'

/**
 * Activation with a single target, which invokes other activations in bulk
 */
export class TargettedAsyncMultiplexActivation<Target> implements TargettedAsyncActivation<Target> {
  protected readonly activations: ActivationContainer<Target>
  public priority: number

  constructor(activations: TargettedActivations<Target>, priority?: number) {
    this.activations = new ActivationContainer(activations)
    this.priority = priority ?? AVERAGE_PRIORITY
  }

  async activateTargettedAsync(target: Target): Promise<void> {
    await this.activations.activateAsyncWithTarget(target)
  }

  public static build<Target>(activations: TargettedActivationCallback<Target>[]): TargettedActivation<Target> {
    const activationObjects = activations.map((activation) => {
      return {
        activateTargetted: (target) => activation(target)
      } satisfies TargettedActivation<Target>
    })
    return new TargettedAsyncMultiplexActivation(activationObjects)
  }
}
