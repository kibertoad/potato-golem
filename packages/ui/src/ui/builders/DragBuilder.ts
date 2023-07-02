import { AbstractUIElementLite } from '../elements/UIGroup'

export function buildDrag(item: AbstractUIElementLite) {
    item
      .setInteractive({ draggable: true })
      .on('dragstart', function (pointer, dragX, dragY) {
        item.setData({ startX: item.x, startY: item.y });
      })
      .on('drag', function (pointer, dragX, dragY) {
        item.setPosition(dragX, dragY);
      })
      .on('dragend', function (pointer, dragX, dragY, dropped) {
        if (dropped) { // Process 'drop' event
          return;
        }

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
