import type {
  Activation,
  AsyncActivation,
  TargettedActivation,
  TargettedAsyncActivation,
} from './Activation'

export abstract class AbstractActivation implements Activation {
  readonly isAsync = false
  readonly isTargetted = false

  abstract activate(): void
}

export function isActivation(entity: unknown): entity is Activation {
  return (entity as AbstractActivation).isAsync === false && (entity as AbstractActivation).isTargetted === false
}

export abstract class AbstractAsyncActivation implements AsyncActivation {
  readonly isAsync = true
  readonly isTargetted = false

  abstract activate(): Promise<void>
}

export function isAsyncActivation(entity: unknown): entity is AsyncActivation {
  return (entity as AbstractAsyncActivation).isAsync === true && (entity as AbstractAsyncActivation).isTargetted === false
}

export abstract class AbstractTargettedActivation<Target> implements TargettedActivation<Target> {
  readonly isAsync = false
  readonly isTargetted = true

  abstract activate(target: Target): void
}

export function isTargettedActivation<Target>(entity: unknown): entity is TargettedActivation<Target> {
  return (entity as AbstractTargettedActivation<Target>).isAsync === false && (entity as AbstractTargettedActivation<Target>).isTargetted === true
}

export abstract class AbstractTargettedAsyncActivation<Target> implements TargettedAsyncActivation<Target> {
  readonly isAsync = true
  readonly isTargetted = true

  abstract activate(target: Target): Promise<void>
}

export function isTargettedAsyncActivation<Target>(entity: unknown): entity is TargettedAsyncActivation<Target> {
  return (entity as AbstractTargettedAsyncActivation<Target>).isAsync === true && (entity as AbstractTargettedAsyncActivation<Target>).isTargetted === true
}
