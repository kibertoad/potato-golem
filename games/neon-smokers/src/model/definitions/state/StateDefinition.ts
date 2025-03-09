import type { ImageId } from '../../../registries/imageRegistry'
import type { RegistryEntityId } from '@potato-golem/core'

export type StateGroup = 'physical' | 'emotional' | 'rumours' | 'knowledge' | 'assets' | 'reputation' | 'environment'

export type StateDefinition = {
  name: string
  description: string
  image: ImageId
  group: StateGroup
  maxAmount?: number // default is 100
}

export type StateDelta = Partial<Record<RegistryEntityId<typeof stateRegistry>, number>>

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

  CRED: 'cred', // fame

  // items

  CHEAP_MEDS: 'cheap_meds',

  RESTRICTED_MOVEMENT: 'restricted_movement'
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
  cheap_meds: {
    name: 'Cheap meds',
    description: 'They are better than trying to sleep it off, but just barely.',
    group: 'assets',
    image: 'rocket',
    maxAmount: 10000,
  },

  cred: {
    name: 'Cred',
    description: 'Renown, reputation, prestige - you name it',
    group: 'reputation',
    image: 'rocket',
    maxAmount: 10000,
  },

  restricted_movement: {
    name: 'Restricted movement',
    description: 'Cannot move freely currently',
    group: 'environment',
    image: 'rocket',
    maxAmount: 1,
  },

} as const satisfies Record<RegistryEntityId<typeof stateRegistry>, StateDefinition>
