import { QueuedActivation } from '@potato-golem/core'
import { EventEmitters } from '../../registries/eventEmitterRegistry'
import { worldModel } from '../../state/WorldModel'
import { SpawnCardActivation } from '../event/extraEventActivations'

export class SingingMushroomActivation extends QueuedActivation {
  description: ''

  constructor() {
    super({
      activatesIn: 1,
      id: 'SingingMushroomActivation',
      description: '',
      unique: true,
      activation: null, // activation method is overriden
    })
  }

  activate(): void {
    if (!worldModel.zones.alchemy.hasCard('SINGING_MUSHROOMS')) {
      const spawnActivation = new SpawnCardActivation(EventEmitters.boardEventEmitter, {
        amount: 1,
        description: '',
        cardId: 'SINGING_MUSHROOMS',
        zone: 'homunculus',
      })
      spawnActivation.activate()
    }
  }
}
