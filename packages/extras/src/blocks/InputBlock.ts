import { InputEvent } from '../input/InputEvents'
import { AbstractBlock } from './AbstractBlock'

export type InputHandler = (event: InputEvent) => void

export class InputBlock extends AbstractBlock {
  registerHandler(event: InputEvent, inputHandler: InputHandler) {
    this.scene.input.keyboard!.on(event, inputHandler)
  }
}
