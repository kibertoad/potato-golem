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
  HEALTH: 'health', // replenished by patching up
  SANITY: 'sanity', // replenished by relaxing

  EXHAUSTION: 'exhaustion', // reduced by enjoyable activities
  TRAUMAS: 'traumas', // reduced by deep treatment
  PSYCHOSIS: 'psychosis', // reduced by tranquil experiences

  KIBBLE: 'kibble',
  POWER_CELLS: 'power_cells',
  GLOW_CHARMS: 'glow_charms',
  PLASTIC_SIGILS: 'plastic_sigils',

  RESTRICTED_MOVEMENT: 'restricted_movement' // set to positive value if in environment from which cannot leave
} as const

export const stateDefinitions = {
  energy: {
    name: 'Energy',
    description: 'Being able to act',
    group: 'physical',
    image: 'rocket',
    maxAmount: 10
  },
  health: {
    name: 'Health',
    description: 'How well are you feeling',
    group: 'physical',
    image: 'rocket',
    maxAmount: 10
  },
  sanity: {
    name: 'Sanity',
    description: 'Being stable',
    group: 'physical',
    image: 'rocket',
    maxAmount: 10,
  },

  exhaustion: {
    name: 'Wounds',
    description: 'Spirit brokenness',
    group: 'physical',
    image: 'rocket',
    maxAmount: 100
  },
  traumas: {
    name: 'Traumas',
    description: 'Body brokenness',
    group: 'physical',
    image: 'rocket',
    maxAmount: 100,
  },
  psychosis: {
    name: 'Traumas',
    description: 'Mind brokenness',
    group: 'physical',
    image: 'rocket',
    maxAmount: 100,
  },

  kibble: {
    name: 'Kibble',
    description: `It is edible, portable, doesn't spoil easily, and it's ancient. These are relics from the time of humans - still nourishing after centuries? That’s holy.`,
    group: 'assets',
    image: 'rocket',
    maxAmount: 10000,
  },
  power_cells: {
    name: 'Power cells',
    description: 'Power - real or symbolic - is sacred. Even dead ones are used in rituals to “fuel” a request or blessing.',
    group: 'assets',
    image: 'rocket',
    maxAmount: 10000,
  },
  glow_charms: {
    name: 'Glow charms',
    description: 'Pieces of LED tech—bike lights, glowsticks, keyboard backlights. They offer brief light in darkness. Some believe they "remember" joy from festivals and gatherings',
    group: 'assets',
    image: 'rocket',
    maxAmount: 10000,
  },
  plastic_sigils: {
    name: 'Plastic sigils',
    description: 'Credit cards, loyalty cards, metro passes—often cracked or faded. Each one carries a unique design - the logo or numbers are interpreted like tarot cards.',
    group: 'assets',
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
