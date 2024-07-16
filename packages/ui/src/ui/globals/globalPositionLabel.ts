import type Phaser from 'phaser'
import type { Scene } from 'phaser'
import { activeDraggedItem, dragCoords, globalTrackers } from './globalState'

export function updateGlobalPositionLabel(label: Phaser.GameObjects.Text) {
  if (!activeDraggedItem) {
    label.setText('No dragged item')
    return
  }

  label.setText(`X: ${activeDraggedItem.x}, Y: ${activeDraggedItem.y}; DragX: ${dragCoords.x}, DragY: ${dragCoords.y}`)
}

export function updateGlobalTrackerLabel(label: Phaser.GameObjects.Text) {
  let composedString = ''
  for (const tracker of globalTrackers) {
    composedString += `${tracker()} `
  }

  label.setText(composedString.length > 0 ? composedString : 'No trackers')
}

export function createGlobalPositionLabel(scene: Scene) {
  return scene.add.text(100, 100, '');
}

export function createGlobalTrackerLabel(scene: Scene) {
  return scene.add.text(400, 200, '');
}
