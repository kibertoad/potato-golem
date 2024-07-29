import { QueuedActivation } from '@potato-golem/core'
import { EventEmitters } from '../../registries/eventEmitterRegistry'
import { worldModel } from '../../state/WorldModel'
import { SpawnCardActivation } from '../event/extraEventActivations'
import { Zone } from '../../registries/zoneRegistry'

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

  private async populate(targetZone: Zone) {
    const spawnActivation = new SpawnCardActivation(EventEmitters.boardEventEmitter, {
      amount: 1,
      description: '',
      cardId: 'SINGING_MUSHROOMS',
      zone: targetZone,
    })
    await spawnActivation.activate()
  }

  private async tryPopulate(targetZone: Zone): Promise<boolean> {
    if (!worldModel.zones[targetZone].hasCard('SINGING_MUSHROOMS')) {
      await this.populate(targetZone)
      return true
    }
    return false
  }

  private async populateNeighbours(startingZone: Zone) {
    switch (startingZone) {
      case 'homunculus': {
        if (await this.tryPopulate('lab')) {
          return
        }
        if (await this.tryPopulate('home')) {
          return
        }
        await this.populate('homunculus')
        break
      }

      case 'lab': {
        if (await this.tryPopulate('homunculus')) {
          return
        }
        await this.populate('lab')
        break
      }

      case 'home': {
        if (await this.tryPopulate('homunculus')) {
          return
        }
        await this.populate('home')
        break
      }
    }
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
