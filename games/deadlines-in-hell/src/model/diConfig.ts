import { Lifetime, type Resolver, asClass, asValue, createContainer } from 'awilix'
import { BoardScene } from '../scenes/board/BoardScene'
import { NextTurnProcessor } from '../scenes/board/model/processors/NextTurnProcessor'
import { MainMenuScene } from '../scenes/main-menu/MainMenuScene'
import { WorldModel } from './state/worldModel'

export const SINGLETON_CONFIG = { lifetime: Lifetime.SINGLETON }
type DiConfig = Record<keyof Dependencies, Resolver<any>>

export interface Dependencies {
  nextTurnProcessor: NextTurnProcessor
  worldModel: WorldModel
  boardScene: BoardScene
  mainMenuScene: MainMenuScene
}

export function instantiateContainer() {
  const diContainer = createContainer<Dependencies>({
    injectionMode: 'PROXY',
  })

  const diConfig: DiConfig = {
    nextTurnProcessor: asClass(NextTurnProcessor, SINGLETON_CONFIG),
    worldModel: asValue(new WorldModel()),
    boardScene: asClass(BoardScene, SINGLETON_CONFIG),
    mainMenuScene: asClass(MainMenuScene, SINGLETON_CONFIG),
  }

  diContainer.register(diConfig)

  return diContainer
}
