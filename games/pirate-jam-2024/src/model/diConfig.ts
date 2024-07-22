import { Lifetime, type Resolver, asClass, asValue, createContainer } from 'awilix'
import { MainMenuScene } from '../scenes/MainMenuScene'
import { MusicScene } from '../scenes/MusicScene'
import { BoardScene } from '../scenes/board/BoardScene'
import { CardDefinitionGenerator } from './definitions/cardDefinitions'
import { EndTurnProcessor } from './processors/EndTurnProcessor'
import { WorldModel } from './state/WorldModel'
import { EventDefinitionGenerator } from './definitions/eventDefinitions'

export const SINGLETON_CONFIG = { lifetime: Lifetime.SINGLETON }
type DiConfig = Record<keyof Dependencies, Resolver<any>>

export interface Dependencies {
  worldModel: WorldModel
  musicScene: MusicScene
  boardScene: BoardScene
  mainMenuScene: MainMenuScene
  endTurnProcessor: EndTurnProcessor
  cardDefinitionGenerator: CardDefinitionGenerator
  eventDefinitionGenerator: EventDefinitionGenerator
}

export function instantiateContainer() {
  const diContainer = createContainer<Dependencies>({
    injectionMode: 'PROXY',
  })

  const diConfig: DiConfig = {
    worldModel: asValue(new WorldModel()),
    cardDefinitionGenerator: asClass(CardDefinitionGenerator, SINGLETON_CONFIG),
    eventDefinitionGenerator: asClass(EventDefinitionGenerator, SINGLETON_CONFIG),

    musicScene: asClass(MusicScene, SINGLETON_CONFIG),
    boardScene: asClass(BoardScene, SINGLETON_CONFIG),
    mainMenuScene: asClass(MainMenuScene, SINGLETON_CONFIG),

    endTurnProcessor: asClass(EndTurnProcessor, SINGLETON_CONFIG),
  }

  diContainer.register(diConfig)

  return diContainer
}
