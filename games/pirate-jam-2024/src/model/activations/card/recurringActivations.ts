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

  async activate(): Promise<void> {
    if (!worldModel.zones.homunculus.hasCard('SINGING_MUSHROOMS')) {
      const spawnActivation = new SpawnCardActivation(EventEmitters.boardEventEmitter, {
        amount: 1,
        description: '',
        cardId: 'SINGING_MUSHROOMS',
        zone: 'homunculus',
      })
      await spawnActivation.activate()
    }
  }
}

export class HungerActivation extends QueuedActivation {
  description: ''

  constructor() {
    super({
      activatesIn: 1,
      id: 'HungerActivation',
      description: '',
      unique: true,
      activation: null, // activation method is overriden
    })
  }

  async activate(): Promise<void> {
    worldModel.homunculusModel.eventSink.emit('STARVE', 1)
  }
}
