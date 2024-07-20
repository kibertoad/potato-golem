import type { CardActivation } from '../activations/CardActivation'
import { DecomposeCardActivation } from '../activations/commonActivations'
import type { Zone } from '../registries/zoneRegistry'

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
