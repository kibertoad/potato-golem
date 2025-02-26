export type OptionWithPreconditions = {
  conditionsToShow?: Precondition[]
  conditionsToEnable?: Precondition[]
}

export type Precondition = {
  isSatisfied(): boolean
}

export type TargettedPrecondition<T> = {
  isSatisfiedForTarget(target: T): boolean
}

export type TargettedReasonedPrecondition<T> = {
  /**
   *
   * @param target The target to check the precondition against
   *
   * @returns true if the precondition is satisfied, false otherwise.
   * If false, a string should be returned explaining why the precondition is not satisfied.
   */
  isSatisfiedForTarget(target: T): true | string
}

export type ReasonedPrecondition = {
  isSatisfied(): true | string
}

export function isPrecondition(entity: unknown): entity is Precondition {
  return 'isSatisfied' in (entity as Precondition)
}

export function isTargettedPrecondition<T>(entity: unknown): entity is TargettedPrecondition<T> {
  return 'isSatisfiedForTarget' in (entity as TargettedPrecondition<T>)
}
