import { ActivationContainer, type RegistryEntityId } from '@potato-golem/core'
import { EndStoryActivation } from '../../../activations/EndStoryActivation'
import type { LocationDefinition } from '../common/LocationDefinition'

export const locationRegistry = {
  EXPLORE_DISTRICT_1: 'exploreDistrict1',
} as const

export const district1LocationDefinitions = {
  exploreDistrict1: {
    id: 'exploreDistrict1',
    name: 'Explore District 1',
    image: 'card_background_decor',
    stories: [
      
    ]
  },
} as const satisfies Record<RegistryEntityId<typeof locationRegistry>, LocationDefinition>
