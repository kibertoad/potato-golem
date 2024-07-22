import { TargettedMultiplexActivation } from '@potato-golem/core'
import type { CardActivation } from '../activations/CardActivation'
import { DecomposeCardActivation, GainHealthActivation } from '../activations/commonActivations'
import type { Dependencies } from '../diConfig'
import type { ImageRegistry } from '../registries/imageRegistry'
import type { Zone } from '../registries/zoneRegistry'
import type { WorldModel } from '../state/WorldModel'

export type IdleZoneEffect = {
  timeTillTrigger: number
  effect: CardActivation
}

export type CardDefinition = {
  id: string
  name: string
  image: (typeof ImageRegistry)[keyof typeof ImageRegistry]

  // Effect that is triggered after card staying within a zone for a while
  idleZoneEffect?: Partial<Record<Zone, IdleZoneEffect>>
}

export type CardDefinitions = ReturnType<
  (typeof CardDefinitionGenerator.prototype)['generateDefinitions']
>

export type CardId = keyof CardDefinitions

export class CardDefinitionGenerator {
  private readonly worldModel: WorldModel

  constructor({ worldModel }: Dependencies) {
    this.worldModel = worldModel
  }

  generateDefinitions() {
    return {
      HEALTH: {
        id: 'HEALTH',
        name: 'Health',
        image: 'health_card',
        idleZoneEffect: {
          homunculus: {
            timeTillTrigger: 1,
            effect: new TargettedMultiplexActivation([
              new GainHealthActivation(this.worldModel.homunculusModel, 1),
              new DecomposeCardActivation(),
            ]),
          },
        },
      },

      MOLDY_SAUSAGE: {
        id: 'MOLDY_SAUSAGE',
        name: 'Moldy Sausage',
        image: 'corpse_card',
        idleZoneEffect: {
          any: {
            timeTillTrigger: 3,
            effect: new DecomposeCardActivation(),
          },
        },
      },

      GOLD: {
        id: 'GOLD',
        name: 'Gold',
        image: 'gold_card',
      },

      MEDICINE: {
        id: 'MEDICINE',
        name: 'Medicne',
        image: 'medicine_card',
        idleZoneEffect: {
          home: {
            timeTillTrigger: 1,
            effect: new TargettedMultiplexActivation([
              new GainHealthActivation(this.worldModel.alchemistModel, 1),
              new DecomposeCardActivation(),
            ]),
          },
        },
      },
    } as const satisfies Record<string, CardDefinition>
  }
}
