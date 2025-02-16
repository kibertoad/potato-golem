import { Precondition } from './Precondition'

export function allConditionsPass(preconditions?: Precondition[]): boolean {
  if (!preconditions) {
    return true
  }
  return preconditions.every((entry) => entry.isSatisfied())
}
