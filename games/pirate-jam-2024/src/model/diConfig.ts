import { Lifetime, type Resolver, asClass, asValue, createContainer } from 'awilix'
import { MainMenuScene } from '../scenes/MainMenuScene'
import { MusicScene } from '../scenes/MusicScene'
import { BoardScene } from '../scenes/board/BoardScene'
import { EndTurnProcessor } from './processors/EndTurnProcessor'
import { type WorldModel, worldModel } from './state/WorldModel'

export const SINGLETON_CONFIG = { lifetime: Lifetime.SINGLETON }
type DiConfig = Record<keyof Dependencies, Resolver<any>>

export interface Dependencies {
  worldModel: WorldModel
  musicScene: MusicScene
  boardScene: BoardScene
  mainMenuScene: MainMenuScene
  endTurnProcessor: EndTurnProcessor
}

export function instantiateContainer() {
  const diContainer = createContainer<Dependencies>({
    injectionMode: 'PROXY',
  })

  const diConfig: DiConfig = {
    worldModel: asValue(worldModel),

    musicScene: asClass(MusicScene, SINGLETON_CONFIG),
    boardScene: asClass(BoardScene, SINGLETON_CONFIG),
    mainMenuScene: asClass(MainMenuScene, SINGLETON_CONFIG),

    endTurnProcessor: asClass(EndTurnProcessor, SINGLETON_CONFIG),
  }

  diContainer.register(diConfig)

  return diContainer
}
