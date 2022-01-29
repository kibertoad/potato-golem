export type Effect<T> = {
    applyEffect (target: T): void
}
