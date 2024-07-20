export type ActivationCallback = () => void

export const LOW_PRIORITY = 10
export const AVERAGE_PRIORITY = 50
export const HIGH_PRIORITY = 100

export type Prioritized = {
  isExclusive?: boolean // if true, this will only trigger if no other activations were triggered
  priority: number // higher numbers means higher execution priority
}

export type PrioritizedActivation = Prioritized & Activation

export type Activation = {
  activate: ActivationCallback
}

export type TargettedActivationCallback<Target> = (target: Target) => void

export type TargettedActivation<Target> = {
  activate: TargettedActivationCallback<Target>
}
