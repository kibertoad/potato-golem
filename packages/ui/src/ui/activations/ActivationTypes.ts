export type ActivationCallback = () => void

export type Activation = {
  activate: () => void
}

export type TargettedActivation<Target> = (target: Target) => void
