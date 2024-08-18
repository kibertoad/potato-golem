import { QueuedActivation, getRandomNumber } from '@potato-golem/core'
import { EventEmitters } from '../../registries/eventEmitterRegistry'
import { type Zone, zoneRegistry } from '../../registries/zoneRegistry'
import { worldModel } from '../../state/WorldModel'
import { SpawnCardActivation } from '../event/extraEventActivations'
import { DecomposeCardActivation } from './cardActivations'

export class SingingMushroomActivation extends QueuedActivation {
  description: ''

  constructor() {
    super({
      activatesIn: 2,
      id: 'SingingMushroomActivation',
      description: '',
      unique: true,
      activations: [], // activation method is overriden
    })
  }

  private async populate(targetZone: Zone) {
    const spawnActivation = new SpawnCardActivation({
      amount: 1,
      description: '',
      cardId: 'SINGING_MUSHROOMS',
      zone: targetZone,
    })
    await spawnActivation.activateTargettedAsync({
      fromEvent: null,
    })
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
      case 'alchemy': {
        if (await this.tryPopulate('lab')) {
          return
        }
        if (await this.tryPopulate('home')) {
          return
        }
        await this.populate('alchemy')
        break
      }

      case 'lab': {
        if (await this.tryPopulate('alchemy')) {
          return
        }
        await this.populate('lab')
        break
      }

      case 'home': {
        if (await this.tryPopulate('alchemy')) {
          return
        }
        await this.populate('home')
        break
      }
    }
  }

  async activateTargetted(): Promise<void> {
    const startingPoints = Object.values(zoneRegistry).filter((zone) => {
      return (
        zone !== 'any' &&
        zone !== 'alchemy' &&
        worldModel.zones.alchemy.hasCard('SINGING_MUSHROOMS')
      )
    })

    if (startingPoints.length === 0) {
      await this.populate('alchemy')
      return
    }

    for (const startingPoint of startingPoints) {
      await this.populateNeighbours(startingPoint)
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
      activations: [], // activation method is overriden
    })
  }

  activateTargetted(): void {
    worldModel.homunculusModel.eventSink.emit('STARVE', 1)
  }
}

export class AlcoholismActivation extends QueuedActivation {
  description: ''

  constructor() {
    super({
      activatesIn: 1,
      id: 'AlcoholismActivation',
      description: '',
      unique: true,
      activations: [], // activation method is overriden
    })
  }

  async activateTargetted(): Promise<void> {
    if (worldModel.zones.home.hasCard('ABSINTHE')) {
      console.log('have booze, will drink')
      const boozeCard = worldModel.zones.home.findCardByID('ABSINTHE')
      const decomposeActivation = new DecomposeCardActivation()
      await decomposeActivation.activateTargettedAsync({
        targetCard: boozeCard.card.model,
      })
      //EventEmitters.boardEventEmitter.emit('DESTROY', boozeCard.card)

      worldModel.alchemistModel.alcoholism.increase(1)

      if (worldModel.alchemistModel.alcoholism.value >= 3) {
        const randomNumber = getRandomNumber(10)
        if (randomNumber >= 5) {
          EventEmitters.boardEventEmitter.emit('SPAWN_MUSE')
        } else {
          EventEmitters.boardEventEmitter.emit('SPAWN_ID')
        }
      }
    }
  }
}

export class EvolutionActivation extends QueuedActivation {
  description: ''

  constructor() {
    super({
      activatesIn: 1,
      id: 'EvolutionActivation',
      description: '',
      unique: true,
      activations: [], // activation method is overriden
    })
  }

  activateTargetted(): void {
    worldModel.homunculusModel.eventSink.emit('EVOLVE', 1)
  }
}

export class TheRaidActivation extends QueuedActivation {
  description: ''

  constructor() {
    super({
      activatesIn: 1,
      id: 'TheRaidActivation',
      description: '',
      unique: true,
      activations: [], // activation method is overriden
    })
  }

  async activateTargetted() {
    if (worldModel.hasCard('THE_RAID')) {
      return
    }

    if (worldModel.theLawIsDead) {
      const spawnActivation = new SpawnCardActivation({
        amount: 1,
        description: '',
        cardId: 'THE_RAID',
        zone: 'streets',
      })
      await spawnActivation.activateTargettedAsync({
        fromEvent: null,
      })
    }
  }
}
