import type { AbstractUIElementLite } from '../elements/UIGroup'
import { Coords } from '@potato-golem/core'

export let activeDraggedItem: AbstractUIElementLite | undefined = undefined
export const dragCoords: Coords = { x: 0, y: 0}

export function setActiveDraggedItem(newValue?: AbstractUIElementLite) {
  activeDraggedItem = newValue
}

export function getActiveDraggedItem(): AbstractUIElementLite | undefined {
  return activeDraggedItem
}
