export type Precondition = {
  isSatisfied(): boolean
}

export type TargettedPrecondition<T> = {
  isSatisfied(target: T): boolean
}
