import { AbstractUIElementLite } from '../elements/UIGroup'
import Pointer = Phaser.Input.Pointer
import { getEntityType } from '../data/ElementDataManipulator'
import { activeDraggedItem, getActiveDraggedItem } from '../globals/globalState'
import GameObject = Phaser.GameObjects.GameObject

export type OnHoverConfig = {
  onHoverCallback?: (draggedItem: any) => void
  onUnhoverCallback?: (draggedItem: any) => void
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

/**
 * This gets invoked if mouse cursor runs over an object while drag is active. generally this is not what you want
 * @param item
 * @param draggedItemType
 * @param config
 */
export function buildOnDragHover(item: GameObject, draggedItemType: string, config: OnHoverConfig) {
  //  item.setInteractive({ pixelPerfect: config.tolerance !== undefined, alphaTolerance: config.tolerance })

  if (config.onHoverCallback) {
    item.on('pointerover', (pointer) => {
      console.log(`point: ${getEntityType(getActiveDraggedItem())}`)

      if (getEntityType(getActiveDraggedItem()) !== draggedItemType) {
        return
      }
      config.onHoverCallback!(getActiveDraggedItem())
    })
  }

  if (config.onUnhoverCallback) {
    item.on('pointerout', (pointer) => {
      console.log(`pointout: ${getEntityType(getActiveDraggedItem())}`)

      if (getEntityType(getActiveDraggedItem()) !== draggedItemType) {
        return
      }
      config.onUnhoverCallback!(getActiveDraggedItem())
    })
  }
}
