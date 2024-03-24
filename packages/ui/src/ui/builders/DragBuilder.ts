import { AbstractUIElementLite } from '../elements/UIGroup'
import Pointer = Phaser.Input.Pointer
import {
  DEFAULT_ENTITY_TYPE,
  getEntityType,
  storeStartPosition,
} from '../elements/ElementDataManipulator'
import { doShapesIntersect } from '../utils/shapeUtils'
import { TargettedActivation, TargettedActivationCallback } from '@potato-golem/core'

export type DragConfig = {
  tolerance?: number
}

export function buildDrag(
  dragStartItem: AbstractUIElementLite,
  draggedItem: AbstractUIElementLite,
  onDropCallback: (pointer: Pointer) => void,
  config: DragConfig,
) {
  let dragDeltaX
  let dragDeltaY

  dragStartItem
    .setInteractive({
      draggable: true,
      pixelPerfect: config.tolerance !== undefined,
      alphaTolerance: config.tolerance,
    })

    .on('dragstart', (pointer, dragX, dragY) => {
      console.log(`dragstart ${draggedItem.x}/${draggedItem.y}`)
      console.log(`dragstart pointer ${pointer.x}/${pointer.y}`)
      dragDeltaX = pointer.x - draggedItem.x
      dragDeltaY = pointer.y - draggedItem.y

      storeStartPosition(draggedItem)
    })
    .on('drag', (pointer, dragX, dragY) => {
      console.log(`Drag: ${dragX}/${dragY}`)
      console.log(`Drag pointer: ${pointer.x}/${pointer.y}`)
      draggedItem.setPosition(pointer.x - dragDeltaX, pointer.y - dragDeltaY)
    })
    .on('dragend', (pointer: Pointer, dragX, dragY, dropped) => {
      if (dropped) {
        // Process 'drop' event
        return
      }
      onDropCallback(pointer)

      console.log('dragend')
    })
    .on('drop', (pointer, target) => {
      console.log('drop')
    })
}

export function buildDragWithActivations<T extends AbstractUIElementLite, U extends AbstractUIElementLite>(
  dragStartItem: T,
  draggedItem: U,
  potentialTargets: readonly AbstractUIElementLite[],
  activations: Record<string, TargettedActivation<any> | TargettedActivationCallback<any>>,
  config: DragConfig,
) {
  buildDrag(
    dragStartItem,
    draggedItem,
    (pointer: Pointer) => {
      console.log('potential targets')
      console.log(potentialTargets)

      const overlappingObject = potentialTargets.find((potentialOverlap) => {
        return doShapesIntersect(potentialOverlap, draggedItem)
      })

      const entityType = overlappingObject ? getEntityType(overlappingObject) : DEFAULT_ENTITY_TYPE
      console.log(`Entity type: ${entityType}`)

      const activation = activations[entityType]
      if (!activation) {
        throw new Error(`Unsupported entity type ${entityType}`)
      }

      if (typeof activation === 'function') {
        activation(overlappingObject)
      } else {
        activation.activate(overlappingObject)
      }
    },
    config,
  )
}
