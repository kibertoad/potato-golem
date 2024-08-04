export const LOW_PRIORITY = 10
export const AVERAGE_PRIORITY = 50
export const HIGH_PRIORITY = 100

export type Prioritized = {
  isExclusive?: boolean // if true, this will only trigger if no other activations were triggered
  priority: number // higher numbers means higher execution priority
}

export type PrioritizedActivation = Prioritized & Activation

/**
 * Abstraction over any kind of effect/trigger
 */
export type ActivationCallback = () => void

/**
 * Class wrapper for ActivationCallback
 */
export type Activation = {
  activate: ActivationCallback
}

/**
 * Effect that targets one specific entity
 */
export type TargettedActivationCallback<Target> = (target: Target) => void

export type TargettedAsyncActivationCallback<Target> = (target: Target) => Promise<void>

/**
 * Class wrapper for TargettedActivationCallback
 */
export type TargettedActivation<Target> = {
  activate: TargettedActivationCallback<Target>
}

export type TargettedAsyncActivation<Target> = {
  activate: TargettedAsyncActivationCallback<Target>
}
