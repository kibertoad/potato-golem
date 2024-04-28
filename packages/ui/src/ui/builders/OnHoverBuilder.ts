import { AbstractUIElementLite } from '../elements/UIGroup'
import Pointer = Phaser.Input.Pointer
import { activeDraggedItem, getActiveDraggedItem } from '../globals/globalState'
import { getEntityType } from '../elements/ElementDataManipulator'
import GameObject = Phaser.GameObjects.GameObject

export type OnHoverConfig = {
  tolerance?: number
}

export function buildOnHover(
  item: GameObject,
  onHoverCallback: (pointer: Pointer) => void,
  onUnhoverCallback: (pointer: Pointer) => void,
  config: OnHoverConfig,
) {
  //item.setInteractive({ pixelPerfect: config.tolerance !== undefined, alphaTolerance: config.tolerance })

  item.on('pointerover', onHoverCallback)
  item.on('pointerout', onUnhoverCallback)
}

export function buildOnDragHover(
  item: GameObject,
  draggedItemType: string,
  onHoverCallback: (pointer: Pointer) => void,
  onUnhoverCallback: (pointer: Pointer) => void,
  config: OnHoverConfig,
) {
  //  item.setInteractive({ pixelPerfect: config.tolerance !== undefined, alphaTolerance: config.tolerance })

  item.on('pointerover', (pointer) => {
    console.log(`point: ${getEntityType(getActiveDraggedItem())}`)

    if (getEntityType(getActiveDraggedItem()) !== draggedItemType) {
      return
    }
    onHoverCallback(pointer)
  })
  item.on('pointerout', (pointer) => {
    console.log(`pointout: ${getEntityType(getActiveDraggedItem())}`)

    if (getEntityType(getActiveDraggedItem()) !== draggedItemType) {
      return
    }
    onUnhoverCallback(pointer)
  })
}
