import type { IdHolder } from '../interfaces/Entities'

/**
 * Split array into smaller arrays that are up to "chunkSize" large
 */
export function chunk<T>(array: readonly T[], chunkSize: number): T[][] {
  const length = array.length
  if (!length || chunkSize < 1) {
    return []
  }
  let index = 0
  let resIndex = 0
  const result = new Array(Math.ceil(length / chunkSize))

  while (index < length) {
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    result[resIndex++] = array.slice(index, (index += chunkSize))
  }

  return result
}

/**
 * Modifies an array by removing an entry with a given id. Returns removed entry
 */
export function removeFromArrayById<T extends IdHolder>(
  targetArray: T[],
  idToRemove: string,
): T | null {
  // Find the index of the element with the given id
  const index = targetArray.findIndex((element) => element.id === idToRemove)

  // If the element is found, remove it from the array
  if (index !== -1) {
    return targetArray.splice(index, 1)[0]!
  }
  return null
}

/**
 * Return a copy of the given array without null or undefined values
 */
export function removeNullish<const T>(array: readonly (T | null | undefined)[]): T[] {
  return array.filter((e) => e !== undefined && e !== null) as T[]
}

/**
 * Return a copy of the given array without falsy values (eg: false, 0, '', null, undefined)
 */
export function removeFalsy<const T>(
  array: readonly (T | null | undefined | 0 | '' | false)[],
): T[] {
  return array.filter((e) => e) as T[]
}
