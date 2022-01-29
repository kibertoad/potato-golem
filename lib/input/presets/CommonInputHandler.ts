import {InputBlock, InputEvent} from "../InputBlock";
import {MovableEntity} from "../../movement/entities/MovableEntity";
import {MovementProcessor} from "../../movement/processors/CommonMovementProcessor";

export type CommonInputHandlerOptions = {
    agent: MovableEntity
    stepSize: number
}

export class CommonInputHandler {
    private movementProcessor: MovementProcessor;

    constructor(movementProcessor: MovementProcessor) {
        this.movementProcessor = movementProcessor
    }

    registerCommonInputHandlers(inputBlock: InputBlock, options: CommonInputHandlerOptions) {
        const { agent, stepSize } = options
        inputBlock.registerHandler(InputEvent.KEY_DOWN_LEFT, () => {
            this.movementProcessor.moveEntity(agent, -stepSize, 0)
        })
        inputBlock.registerHandler(InputEvent.KEY_DOWN_LEFT, () => {
            this.movementProcessor.moveEntity(agent, -stepSize, 0)
        })
        inputBlock.registerHandler(InputEvent.KEY_DOWN_RIGHT, () => {
            this.movementProcessor.moveEntity(agent, stepSize, 0)
        })
        inputBlock.registerHandler(InputEvent.KEY_DOWN_DOWN, () => {
            this.movementProcessor.moveEntity(agent, 0, stepSize)
        })
        inputBlock.registerHandler(InputEvent.KEY_DOWN_UP, () => {
            this.movementProcessor.moveEntity(agent, 0, -stepSize)
        })
    }
}


