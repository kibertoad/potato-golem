export function randomOneOf<T>(items: T[]): T {
  return items[items.length * Math.random() | 0]
}