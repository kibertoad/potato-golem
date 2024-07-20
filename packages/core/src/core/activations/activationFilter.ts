import type { Prioritized } from './Activation'

export function sortAndFilterActivations<T extends Prioritized>(activations: readonly T[]): T[] {
  // Step 0: Check if the array is empty
  if (activations.length === 0) {
    return []
  }

  // Step 1: Create a new array with the sorted activations by priority in descending order (immutable sort)
  const sortedActivations = [...activations].sort((a, b) => b.priority - a.priority)

  // Step 2: Check for the top priority entry and handle isExclusive logic
  if (sortedActivations[0].isExclusive) {
    return [sortedActivations[0]] // If the top priority entry isExclusive, return only it
  }

  // Step 3: If no isExclusive at the top, filter out all isExclusive entries
  return sortedActivations.filter((activation) => !activation.isExclusive)
}
