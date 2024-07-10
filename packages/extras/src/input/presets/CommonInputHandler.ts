import type { InputBlock } from '../../blocks/InputBlock'
import type { MovableEntity } from '../../movement/entities/MovableEntity'
import type { MovementProcessor } from '../../movement/processors/CommonMovementProcessor'
import { InputEvent } from '../InputEvents'

export type CommonInputHandlerOptions = {
  stepSize: number
}

export class CommonInputHandler {
  private agent!: MovableEntity
  private movementProcessor: MovementProcessor

  constructor(movementProcessor: MovementProcessor) {
    this.movementProcessor = movementProcessor
  }

  setAgent(agent: MovableEntity) {
    this.agent = agent
  }

  registerCommonInputHandlers(inputBlock: InputBlock, options: CommonInputHandlerOptions) {
    const { stepSize } = options

    inputBlock.registerHandler(InputEvent.KEY_DOWN_LEFT, () => {
      this.movementProcessor.moveEntity(this.agent, -stepSize, 0)
    })
    inputBlock.registerHandler(InputEvent.KEY_DOWN_LEFT, () => {
      this.movementProcessor.moveEntity(this.agent, -stepSize, 0)
    })
    inputBlock.registerHandler(InputEvent.KEY_DOWN_RIGHT, () => {
      this.movementProcessor.moveEntity(this.agent, stepSize, 0)
    })
    inputBlock.registerHandler(InputEvent.KEY_DOWN_DOWN, () => {
      this.movementProcessor.moveEntity(this.agent, 0, stepSize)
    })
    inputBlock.registerHandler(InputEvent.KEY_DOWN_UP, () => {
      this.movementProcessor.moveEntity(this.agent, 0, -stepSize)
    })
  }
}
