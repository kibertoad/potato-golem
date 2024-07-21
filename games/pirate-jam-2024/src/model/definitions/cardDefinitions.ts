import type { CardActivation } from '../activations/CardActivation'
import { DecomposeCardActivation } from '../activations/commonActivations'
import type { Zone } from '../registries/zoneRegistry'
import { MultiplexActivation, TargettedMultiplexActivation } from '@potato-golem/core'

export type IdleZoneEffect = {
  timeTillTrigger: number
  effect: CardActivation
}

export type CardDefinition = {
  id: string
  name: string
  idleZoneEffect?: Partial<Record<Zone, IdleZoneEffect>>
}

export const cardDefinitions = {
  HEALTH: {
    id: 'HEALTH',
    name: 'Health',
    idleZoneEffect: {
      homunculus: {
        timeTillTrigger: 1,
        effect: new TargettedMultiplexActivation([
          new DecomposeCardActivation()
        ]),
      },
    },
  },

  MOLDY_SAUSAGE: {
    id: 'MOLDY_SAUSAGE',
    name: 'Moldy Sausage',
    idleZoneEffect: {
      any: {
        timeTillTrigger: 3,
        effect: new DecomposeCardActivation(),
      },
    },
  },
} as const satisfies Record<string, CardDefinition>
