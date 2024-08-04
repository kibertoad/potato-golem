import { AVERAGE_PRIORITY, type TargettedActivation, type TargettedActivationCallback } from '../common/Activation'

/**
 * Activation with a single target, which invokes other activations in bulk
 */
export class TargettedAsyncMultiplexActivation<Target> implements TargettedActivation<Target> {
  protected readonly activations: TargettedActivation<Target>[]
  public priority: number

  constructor(activations: TargettedActivation<Target>[], priority?: number) {
    this.activations = activations
    this.priority = priority ?? AVERAGE_PRIORITY
  }

  async activate(target: Target): Promise<void> {
    for (const activation of this.activations) {
      // console.log('Activating', activation)
      await activation.activate(target)
      // console.log('Activated', activation)
    }
  }

  public static build<Target>(activations: TargettedActivationCallback<Target>[]): TargettedActivation<Target> {
    const activationObjects = activations.map((activation) => {
      return {
        activate: (target) => activation(target)
      } satisfies TargettedActivation<Target>
    })
    return new TargettedAsyncMultiplexActivation(activationObjects)
  }
}