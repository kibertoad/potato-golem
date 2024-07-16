import type { AbstractUIElementLite } from '../elements/UIGroup'
import { Coords } from '@potato-golem/core'

export let activeDraggedItem: AbstractUIElementLite | undefined = undefined
export const dragCoords: Coords = { x: 0, y: 0}

export type Tracker = () => string

export const globalTrackers: Tracker[] = []

export function setActiveDraggedItem(newValue?: AbstractUIElementLite) {
  activeDraggedItem = newValue
}

export function getActiveDraggedItem(): AbstractUIElementLite | undefined {
  return activeDraggedItem
}

export function resetGlobalTrackers() {
  globalTrackers.splice(0, globalTrackers.length)
}

export function addGlobalTracker(tracker: Tracker) {
  globalTrackers.push(tracker)
}
