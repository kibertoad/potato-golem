import { AbstractUIElementLite } from '../elements/UIGroup'
import Pointer = Phaser.Input.Pointer
import {
  DEFAULT_ENTITY_TYPE,
  getEntityType,
  storeStartPosition,
} from '../elements/ElementDataManipulator'
import { doShapesIntersect } from '../utils/shapeUtils'
import { TargettedActivation, TargettedActivationCallback } from '@potato-golem/core'
import GameObject = Phaser.GameObjects.GameObject
import { setActiveDraggedItem } from '../globals/globalState'

export enum DRAG_EVENTS {
  'ENTER_HOVER' = 'ENTER_HOVER',
  'LEAVE_HOVER' = 'LEAVE_HOVER'
}

export type DragConfig = {
  tolerance?: number
}

type DragOptions = {
  dragStartItem: AbstractUIElementLite,
  draggedItem: AbstractUIElementLite,
  onDropCallback: (pointer: Pointer) => void,
  onHoverCallback?: (pointer: Pointer) => void,
  config: DragConfig,
}

export function buildDrag(
  options: DragOptions
) {
  let dragDeltaX = 0
  let dragDeltaY = 0

  options.dragStartItem
    .setInteractive({
      draggable: true,
      pixelPerfect: options.config.tolerance !== undefined,
      alphaTolerance: options.config.tolerance,
    })

    .on('dragstart', (pointer, dragX, dragY) => {
      setActiveDraggedItem(options.dragStartItem)

      //console.log(`dragstart ${draggedItem.x}/${draggedItem.y}`)
      //console.log(`dragstart pointer ${pointer.x}/${pointer.y}`)
      dragDeltaX = pointer.x - options.draggedItem.x
      dragDeltaY = pointer.y - options.draggedItem.y

      storeStartPosition(options.draggedItem)
    })
    .on('drag', (pointer, dragX, dragY) => {
      //console.log(`Drag: ${dragX}/${dragY}`)
      //console.log(`Drag pointer: ${pointer.x}/${pointer.y}`)

      options.draggedItem.setPosition(pointer.x - dragDeltaX, pointer.y - dragDeltaY)
    })
    .on('dragend', (pointer: Pointer, dragX, dragY, dropped) => {
      if (dropped) {
        // Process 'drop' event
        return
      }
      options.onDropCallback(pointer)

      console.log('dragend')
      setActiveDraggedItem(undefined)

    })
    .on('drop', (pointer, target) => {
      console.log('drop')
    })
}

export type DragActivationOptions<T, U> = {
  dragStartItem: T,
  draggedItem: U,
  config: DragConfig,

  potentialDropTargets: readonly AbstractUIElementLite[],
  dropActivations: Record<string, TargettedActivation<any> | TargettedActivationCallback<any>>,

  potentialHoverTargets: readonly GameObject[],
}

export function buildDragWithActivations<T extends AbstractUIElementLite, U extends AbstractUIElementLite>(
  options: DragActivationOptions<T, U>
) {
  let currentlyHoveredObject: AbstractUIElementLite | undefined

  buildDrag({
    dragStartItem: options.dragStartItem,
    draggedItem: options.draggedItem,
    config: options.config,
    onDropCallback: (pointer: Pointer) => {
      console.log('potential targets')
      console.log(options.potentialDropTargets)

      const overlappingObject = options.potentialDropTargets.find((potentialOverlap) => {
        return doShapesIntersect(potentialOverlap, options.draggedItem)
      })

      const entityType = overlappingObject ? getEntityType(overlappingObject) : DEFAULT_ENTITY_TYPE
      console.log(`Drag drop target entity type: ${entityType}`)

      const activation = options.dropActivations[entityType]
      if (!activation) {
        throw new Error(`Unsupported entity type ${entityType}`)
      }

      if (typeof activation === 'function') {
        activation(overlappingObject)
      } else {
        activation.activate(overlappingObject)
      }
    },
    /*
    onHoverCallback: (pointer: Pointer) => {
      return undefined
      const overlappingObject = options.potentialDropTargets.find((potentialOverlap) => {
        return doShapesIntersect(potentialOverlap, options.draggedItem)
      })

      if (overlappingObject === currentlyHoveredObject) {
        return
      }

      if (!overlappingObject && !currentlyHoveredObject) {
        return
      }

      if (!overlappingObject) {
        currentlyHoveredObject!.emit(DRAG_EVENTS.LEAVE_HOVER, options.draggedItem)
        currentlyHoveredObject = undefined
        return
      }

      currentlyHoveredObject = overlappingObject
      currentlyHoveredObject?.emit(DRAG_EVENTS.ENTER_HOVER, options.draggedItem)
    }

     */
    }
  )
}
