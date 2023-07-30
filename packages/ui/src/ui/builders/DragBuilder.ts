import { AbstractUIElementLite } from '../elements/UIGroup'
import Pointer = Phaser.Input.Pointer
import { TargettedActivation } from '../activations/ActivationTypes'
import Shape = Phaser.GameObjects.Shape
import { ENTITY_TYPE_DATA_KEY } from '../common/EntityDataKeys'
import { doShapesIntersect } from '../utils/shapeUtils'

export function buildDrag(item: AbstractUIElementLite, onDropCallback: (pointer: Pointer) => void) {
    item
      .setInteractive({ draggable: true })
      .on('dragstart', function (pointer, dragX, dragY) {
        item.setData({ startX: item.x, startY: item.y });
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

export function buildDragWithActivations<T extends AbstractUIElementLite> (item: T,
                                          potentialTargets: readonly Shape[],
                                          activations: Record<string, TargettedActivation<unknown>>) {
  buildDrag(item, (pointer: Pointer) => {
    const overlappingObject = potentialTargets.find((potentialOverlap) => {
      return doShapesIntersect(potentialOverlap, item)
      })

      if (overlappingObject) {
        const entityType = overlappingObject.getData(ENTITY_TYPE_DATA_KEY)
        const activation: TargettedActivation<T> = activations[entityType]
        if (!activation) {
          throw new Error(`Unsupported entity type ${entityType}`)
        }

        activation(item)
      }
  })
}
