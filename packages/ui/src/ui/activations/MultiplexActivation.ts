import { Activation, ActivationCallback } from "@potato-golem/core"

export class MultiplexActivation implements Activation {
  private readonly activations: ActivationCallback[]

  private constructor(activations: ActivationCallback[]) {
    this.activations = activations
  }

  activate() {
    for (const activation of this.activations) {
      activation()
    }
  }

  public static build(activations: ActivationCallback[]): ActivationCallback {
    const activation = new MultiplexActivation(activations)
    return () => {
      activation.activate()
    }
  }
}
