import {
  isActivation,
  isAsyncActivation,
  isTargettedActivation,
  isTargettedAsyncActivation,
} from './AbstractActivation'
import type {
  Activation,
  Activations,
  AsyncActivation,
  TargettedActivation,
  TargettedActivations,
  TargettedAsyncActivation,
} from './Activation'

export type AnyActivation<Target = unknown> = | Activation
  | AsyncActivation
  | TargettedActivation<Target>
  | TargettedAsyncActivation<Target>

export class ActivationContainer<Target = unknown> {
  private readonly activations: Activation[] = []
  private readonly asyncActivations: AsyncActivation[] = []
  private readonly targettedActivations: TargettedActivation<Target>[] = []
  private readonly targettedAsyncActivations: TargettedAsyncActivation<Target>[] = []

  private allActivations: Array<
    Activation | AsyncActivation | TargettedActivation<Target> | TargettedAsyncActivation<Target>
  > = []

  constructor(activations?: Activations | TargettedActivations<Target>) {
    if (activations) {
      this.addBulk(activations as (Activation | AsyncActivation)[])
    }
  }

  addBulk(
    activations: readonly (AnyActivation<Target>)[],
  ) {
    for (const activation of activations) {
      this.add(activation)
    }
    return this
  }

  add(
    activation:
      | Activation
      | AsyncActivation
      | TargettedActivation<Target>
      | TargettedAsyncActivation<Target>,
  ) {
    this.allActivations.push(activation)

    if (isActivation(activation)) {
      this.activations.push(activation)
      return this
    }

    if (isAsyncActivation(activation)) {
      this.asyncActivations.push(activation)
      return this
    }

    if (isTargettedActivation(activation)) {
      this.targettedActivations.push(activation)
      return this
    }

    if (isTargettedAsyncActivation(activation)) {
      this.targettedAsyncActivations.push(activation)
      return this
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
      activation.activateTargetted(target)
    }
  }

  async activateAsync(): Promise<void> {
    for (const activation of this.activations) {
      activation.activate()
    }

    for (const activation of this.asyncActivations) {
      await activation.activateAsync()
    }
  }

  async activateAsyncWithTarget(target: Target): Promise<void> {
    for (const activation of this.activations) {
      activation.activate()
    }

    for (const activation of this.targettedActivations) {
      activation.activateTargetted(target)
    }

    for (const activation of this.asyncActivations) {
      await activation.activateAsync()
    }

    for (const activation of this.targettedAsyncActivations) {
      await activation.activateTargettedAsync(target)
    }
  }

  static instance() {
    return new ActivationContainer()
  }

  private rebuildAllActivations() {
    this.allActivations = [
      ...this.activations,
      ...this.asyncActivations,
      ...this.targettedActivations,
      ...this.targettedAsyncActivations,
    ]
  }

  getAllActivations() {
    return this.allActivations
  }

  static fromEffectList(effects?: readonly AnyActivation[]) {
    if (!effects || effects.length === 0) {
      return EMPTY_ACTIVATION_CONTAINER
    }
    return new ActivationContainer().addBulk(effects)
  }
}

class EmptyActivationContainer extends ActivationContainer {

  override addBulk(): never {
    throw new Error('Immutable container')
  }

  override add(): never {
    throw new Error('Immutable container')
  }

  override activateOnlySync() {}

  override activateOnlySyncWithTarget() {}

  override activateAsync(): Promise<void> {
    return Promise.resolve()
  }

  override activateAsyncWithTarget(): Promise<void> {
    return Promise.resolve()
  }

  override getAllActivations(): Array<Activation | AsyncActivation> {
    return [];
  }
}

const EMPTY_ACTIVATION_CONTAINER = new EmptyActivationContainer()
