import GameObject = Phaser.GameObjects.GameObject
import { AbstractUIElementLite } from '../elements/UIGroup'

export let activeDraggedItem: AbstractUIElementLite | undefined = undefined

export function setActiveDraggedItem(newValue?: AbstractUIElementLite) {
  activeDraggedItem = newValue
}

export function getActiveDraggedItem(): AbstractUIElementLite | undefined {
  return activeDraggedItem
}

