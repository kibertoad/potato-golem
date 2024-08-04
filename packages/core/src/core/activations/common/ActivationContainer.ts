import type { Activation, AsyncActivation, TargettedActivation, TargettedAsyncActivation } from './Activation'
import {
  isActivation,
  isAsyncActivation,
  isTargettedActivation,
  isTargettedAsyncActivation,
} from './AbstractActivation'

export class ActivationContainer<Target> {

  private readonly activations: Activation[] = []
  private readonly asyncActivations: AsyncActivation[] = []
  private readonly targettedActivations: TargettedActivation<Target>[] = []
  private readonly targettedAsyncActivations: TargettedAsyncActivation<Target>[] = []

  addBulk(activations: (Activation | AsyncActivation | TargettedActivation<Target> | TargettedAsyncActivation<Target>)[]) {
    for (const activation of activations) {
      this.add(activation)
    }
  }

  add(activation: Activation | AsyncActivation | TargettedActivation<Target> | TargettedAsyncActivation<Target>) {
    if (isActivation(activation)) {
      this.activations.push(activation)
      return
    }

    if (isAsyncActivation(activation)) {
      this.asyncActivations.push(activation)
      return
    }

    if (isTargettedActivation(activation)) {
      this.targettedActivations.push(activation)
      return
    }

    if (isTargettedAsyncActivation(activation)) {
      this.targettedAsyncActivations.push(activation)
      return
    }

    return this
  }

  activateOnlySync() {
    for (const activation of this.activations) {
      activation.activate()
    }
  }

  activateOnlySyncWithTarget(target: Target) {
    this.activateOnlySync()

    for (const activation of this.targettedActivations) {
      activation.activate(target)
    }
  }

  async activateAsync(): Promise<void> {
    for (const activation of this.activations) {
      activation.activate()
    }

    for (const activation of this.asyncActivations) {
      await activation.activate()
    }
  }

  async activateAsyncWithTarget(target: Target): Promise<void> {
    for (const activation of this.activations) {
      activation.activate()
    }

    for (const activation of this.targettedActivations) {
      activation.activate(target)
    }

    for (const activation of this.asyncActivations) {
      await activation.activate()
    }

    for (const activation of this.targettedAsyncActivations) {
      await activation.activate(target)
    }
  }

  static instance() {
    return new ActivationContainer()
  }
}
