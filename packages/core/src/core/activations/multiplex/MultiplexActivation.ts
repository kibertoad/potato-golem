import type { Activation, ActivationCallback } from '../common/Activation'

/**
 * Activation which invokes other activations in bulk
 */
export class MultiplexActivation implements Activation {
  private readonly activations: Activation[]

  constructor(activations: Activation[]) {
    this.activations = activations
  }

  // ToDo revise this logic
  activateTargetted(...args: []): void {
    for (const activation of this.activations) {
      activation.activateTargetted.apply(activation, args)
    }
  }

  public static buildCallback(activations: ActivationCallback[]): ActivationCallback {
    return () => {
      for (const activation of activations) {
        activation()
      }
    }
  }
}
