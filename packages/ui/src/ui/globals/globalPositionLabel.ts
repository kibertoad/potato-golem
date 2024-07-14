import type Phaser from 'phaser'
import type { Scene } from 'phaser'
import { activeDraggedItem } from './globalState'

export function updateGlobalPositionLabel(label: Phaser.GameObjects.Text) {
  if (!activeDraggedItem) {
    label.setText('No dragged item')
    return
  }

  label.setText(`X: ${activeDraggedItem.x}, Y: ${activeDraggedItem.y}`)
}

export function createGlobalPositionLabel(scene: Scene) {
  return scene.add.text(100, 100, '');
}
