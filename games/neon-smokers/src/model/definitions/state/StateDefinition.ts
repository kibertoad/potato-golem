import type { ImageId } from '../../../registries/imageRegistry'
import { RegistryEntityId } from '@potato-golem/core'
import { ChoiceDefinition } from '../definitionInterfaces'
import { choiceRegistry } from '../zones/01_district1/district1ChoiceDefinitions'

export type StateGroup = 'physical' | 'emotional' | 'rumours' | 'knowledge' | 'assets' | 'reputation'

export type StateDefinition = {
  name: string
  description: string
  image: ImageId
  group: StateGroup
  maxAmount?: number // default is 100
}

export const stateRegistry = {
  ENERGY: 'energy', // replenished by sleep and rest
  EXHAUSTION: 'exhaustion', // replenished by enjoyable activities

  WOUNDS: 'wounds', // replenished by patching up
  TRAUMAS: 'traumas', // replenished by deep treatment, slowly

  /*
  STRESS: 'stress', // replenished by resting
  PSYCHOSIS: 'psychosis', // replenished by therapy

   */

  EUROS: 'euros', // money

  CRED: 'cred' // fame
} as const

export const stateDefinitions = {
  energy: {
    name: 'Energy',
    description: 'Being able to act',
    group: 'physical',
    image: 'rocket',
    maxAmount: 10
  },
  exhaustion: {
    name: 'Exhaustion',
    description: 'Being exhausted',
    group: 'physical',
    image: 'rocket',
    maxAmount: 10,
  },

  wounds: {
    name: 'Wounds',
    description: 'Light wounds',
    group: 'physical',
    image: 'rocket',
    maxAmount: 10
  },
  traumas: {
    name: 'Traumas',
    description: 'Body brokenness',
    group: 'physical',
    image: 'rocket',
    maxAmount: 10,
  },

  euros: {
    name: 'Euros',
    description: 'Money',
    group: 'assets',
    image: 'rocket',
    maxAmount: 10000000,
  },
  cred: {
    name: 'Cred',
    description: 'Renown, reputation, prestige - you name it',
    group: 'reputation',
    image: 'rocket',
    maxAmount: 10000,
  },

} as const satisfies Record<RegistryEntityId<typeof stateRegistry>, StateDefinition>
