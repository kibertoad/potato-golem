import { Lifetime, type Resolver, asClass, asValue, createContainer } from 'awilix'
import { WorldModel } from './WorldModel'
import { BoardScene } from '../scenes/board/BoardScene'
import { MainMenuScene } from '../scenes/MainMenuScene'

export const SINGLETON_CONFIG = { lifetime: Lifetime.SINGLETON }
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type DiConfig = Record<keyof Dependencies, Resolver<any>>

export interface Dependencies {
  worldModel: WorldModel
  boardScene: BoardScene
  mainMenuScene: MainMenuScene
}

export function instantiateContainer() {
  const diContainer = createContainer<Dependencies>({
    injectionMode: 'PROXY',
  })

  const diConfig: DiConfig = {
    worldModel: asValue(new WorldModel()),
    boardScene: asClass(BoardScene, SINGLETON_CONFIG),
    mainMenuScene: asClass(MainMenuScene, SINGLETON_CONFIG),
  }

  diContainer.register(diConfig)

  return diContainer
}
