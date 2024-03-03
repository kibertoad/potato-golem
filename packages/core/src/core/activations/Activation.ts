export type ActivationCallback = () => void

export type Activation = {
  activate: ActivationCallback
}

export type TargettedActivationCallback<Target> = (target: Target) => void

export type TargettedActivation<Target> = {
  activate: TargettedActivationCallback<Target>
}
