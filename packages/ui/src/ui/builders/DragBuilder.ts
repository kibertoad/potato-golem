import { AbstractUIElementLite } from '../elements/UIGroup'
import Pointer = Phaser.Input.Pointer
import { TargettedActivation } from '../activations/ActivationTypes'
import Shape = Phaser.GameObjects.Shape
import { ENTITY_TYPE_DATA_KEY } from '../common/EntityDataKeys'

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

        /*
        item.moveTo({
          x: item.getData('startX'), y: item.getData('startY'),
          speed: 300
        });
         */

        console.log('dragend')
      })
      .on('drop', function (pointer, target) {
        console.log('lol')
      })
}

export function buildDragWithActivations<T extends AbstractUIElementLite> (item: T,
                                          potentialTargets: readonly Shape[],
                                          activations: Record<string, TargettedActivation<unknown>>) {
  buildDrag(item, (pointer: Pointer) => {
      const overlappingObject = potentialTargets.find((entity) => {
        return entity.getBounds().contains(pointer.x, pointer.y)
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
