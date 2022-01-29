import {AbstractBlock} from "../core/AbstractBlock";

export enum InputEvent {
    KEY_UP_LEFT = 'keyup-LEFT',
    KEY_UP_RIGHT = 'keyup-RIGHT',
    KEY_UP_UP = 'keyup-UP',
    KEY_UP_DOWN = 'keyup-DOWN',
    KEY_UP_ENTER = 'keyup-ENTER',
    KEY_UP_SPACE = 'keyup-SPACE',

    KEY_DOWN_LEFT = 'keydown-LEFT',
    KEY_DOWN_RIGHT = 'keydown-RIGHT',
    KEY_DOWN_UP = 'keydown-UP',
    KEY_DOWN_DOWN = 'keydown-DOWN',
    KEY_DOWN_ENTER = 'keydown-ENTER',
    KEY_DOWN_SPACE = 'keydown-SPACE',
}

export type InputHandler = (event: InputEvent) => void

export class InputBlock extends AbstractBlock {

    registerHandler(event: InputEvent, inputHandler: InputHandler) {
        this.scene.input.keyboard.on(event, inputHandler)
    }

}
