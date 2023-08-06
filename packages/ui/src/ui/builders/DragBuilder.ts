import { AbstractUIElementLite } from '../elements/UIGroup'
import Pointer = Phaser.Input.Pointer
import { TargettedActivation, TargettedActivationCallback } from '../activations/ActivationTypes'
import { doShapesIntersect } from '../utils/shapeUtils'
import { DEFAULT_ENTITY_TYPE, getEntityType, storeStartPosition } from '../elements/ElementDataManipulator'

export type DragConfig = {
  tolerance?: number
}

export function buildDrag(item: AbstractUIElementLite, onDropCallback: (pointer: Pointer) => void, config: DragConfig) {
    item
      .setInteractive({ draggable: true, pixelPerfect: config.tolerance !== undefined, alphaTolerance: config.tolerance })

      .on('dragstart', function (pointer, dragX, dragY) {
        storeStartPosition(item)
      })
      .on('drag', function (pointer, dragX, dragY) {
        item.setPosition(dragX, dragY);
      })
      .on('dragend', function (pointer: Pointer, dragX, dragY, dropped) {
        if (dropped) { // Process 'drop' event
          return;
        }
        onDropCallback(pointer)

        console.log('dragend')
      })
      .on('drop', function (pointer, target) {
        console.log('drop')
      })
}

export function buildDragWithActivations<T extends AbstractUIElementLite> (draggedItem: T,
                                          potentialTargets: readonly AbstractUIElementLite[],
                                          activations: Record<string, TargettedActivation<any> | TargettedActivationCallback<any>>, config: DragConfig) {
  buildDrag(draggedItem, (pointer: Pointer) => {
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
  }, config)
}
