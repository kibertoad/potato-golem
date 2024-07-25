import { AVERAGE_PRIORITY, type TargettedActivation, type TargettedActivationCallback } from './Activation'

/**
 * Activation with a single target, which invokes other activations in bulk
 */
export class TargettedMultiplexActivation<Target> implements TargettedActivation<Target> {
  protected readonly activations: TargettedActivation<Target>[]
  public priority: number

  constructor(activations: TargettedActivation<Target>[], priority?: number) {
    this.activations = activations
    this.priority = priority ?? AVERAGE_PRIORITY
  }

  async activate(target: Target) {
    for (const activation of this.activations) {
      console.log('Activating', activation)
      await activation.activate(target)
      console.log('Activated', activation)
    }
  }

  public static build<Target>(activations: TargettedActivationCallback<Target>[]): TargettedActivation<Target> {
    const activationObjects = activations.map((activation) => {
      return {
        activate: (target) => activation(target)
      } satisfies TargettedActivation<Target>
    })
    return new TargettedMultiplexActivation(activationObjects)
  }
}
