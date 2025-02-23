import { Lifetime, type NameAndRegistrationPair, asClass, asValue, createContainer } from 'awilix'
import { MainMenuScene } from '../scenes/MainMenuScene'
import { WorldModel } from './entities/WorldModel'
import { EndTurnProcessor } from './processors/EndTurnProcessor'
import {ZoneScene} from "../scenes/zone/ZoneScene";

export const SINGLETON_CONFIG = { lifetime: Lifetime.SINGLETON }
type DiConfig = NameAndRegistrationPair<Dependencies>

export interface Dependencies {
  worldModel: WorldModel
  boardScene: ZoneScene
  mainMenuScene: MainMenuScene
  endTurnProcessor: EndTurnProcessor
}

export function instantiateContainer() {
  const diContainer = createContainer<Dependencies>({
    injectionMode: 'PROXY',
  })

  const diConfig: DiConfig = {
    worldModel: asValue(new WorldModel()),
    boardScene: asClass(ZoneScene, SINGLETON_CONFIG),
    mainMenuScene: asClass(MainMenuScene, SINGLETON_CONFIG),
    endTurnProcessor: asClass(EndTurnProcessor, SINGLETON_CONFIG),
  }

  diContainer.register(diConfig)

  return diContainer
}
