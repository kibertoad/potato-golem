import type {
  Activation,
  AsyncActivation,
  TargettedActivation,
  TargettedAsyncActivation,
} from './Activation'

export function isActivation(entity: unknown): entity is Activation {
  return 'activate' in (entity as Activation)
}

export function isAsyncActivation(entity: unknown): entity is AsyncActivation {
  return 'activateAsync' in (entity as AsyncActivation)
}

export function isTargettedActivation<Target>(
  entity: unknown,
): entity is TargettedActivation<Target> {
  return 'activateTargetted' in (entity as TargettedActivation<unknown>)
}

export function isTargettedAsyncActivation<Target>(
  entity: unknown,
): entity is TargettedAsyncActivation<Target> {
  return 'activateTargettedAsync' in (entity as TargettedAsyncActivation<unknown>)
}
