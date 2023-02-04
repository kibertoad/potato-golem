import { InputBlock } from '../../blocks/InputBlock'
import { InputEvent } from '../InputEvents'
import { MovableEntity } from '../../movement/entities/MovableEntity'
import { MovementProcessor } from '../../movement/processors/CommonMovementProcessor'

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
