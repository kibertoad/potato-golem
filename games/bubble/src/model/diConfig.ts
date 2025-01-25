import { Lifetime, type NameAndRegistrationPair, asClass, asValue, createContainer } from 'awilix'
import { MainMenuScene } from '../scenes/MainMenuScene'
import { BoardScene } from '../scenes/board/BoardScene'
import { MovementProcessor } from '../scenes/board/processors/MovementProcessor'
import { WorldModel } from './entities/WorldModel'
import { EndTurnProcessor } from './processors/EndTurnProcessor'

export const SINGLETON_CONFIG = { lifetime: Lifetime.SINGLETON }
type DiConfig = NameAndRegistrationPair<Dependencies>

export interface Dependencies {
  worldModel: WorldModel
  boardScene: BoardScene
  mainMenuScene: MainMenuScene
  endTurnProcessor: EndTurnProcessor
  movementProcessor: MovementProcessor
}

export function instantiateContainer() {
  const diContainer = createContainer<Dependencies>({
    injectionMode: 'PROXY',
  })

  const diConfig: DiConfig = {
    worldModel: asValue(new WorldModel()),
    boardScene: asClass(BoardScene, SINGLETON_CONFIG),
    mainMenuScene: asClass(MainMenuScene, SINGLETON_CONFIG),
    endTurnProcessor: asClass(EndTurnProcessor, SINGLETON_CONFIG),
    movementProcessor: asClass(MovementProcessor, SINGLETON_CONFIG),
  }

  diContainer.register(diConfig)

  return diContainer
}
