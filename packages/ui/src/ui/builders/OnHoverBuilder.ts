import { AbstractUIElementLite } from '../elements/UIGroup'
import Pointer = Phaser.Input.Pointer

export type OnHoverConfig = {
  tolerance?: number
}

export function buildOnHover(item: AbstractUIElementLite, onHoverCallback: (pointer: Pointer) => void, onUnhoverCallback: (pointer: Pointer) => void, config: OnHoverConfig) {
//  item.setInteractive({ pixelPerfect: config.tolerance !== undefined, alphaTolerance: config.tolerance })

  item.on('pointerover',onHoverCallback)
  item.on('pointerout',onUnhoverCallback)
}
