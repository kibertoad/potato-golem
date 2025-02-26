import {ActivationContainer, type RegistryEntityId} from '@potato-golem/core'
import type { LocationDefinition } from '../common/LocationDefinition'
import {EnterLocationActivation} from "../../../activations/EnterLocationActivation";
import {NeverPrecondition} from "../../../preconditions/NeverPrecondition";

export const locationRegistry = {
  EXPLORE_DISTRICT_1: 'exploreDistrict1',
  BACK_ALLEY_SAWBONES: 'backAlleySawbones',
  YACHT: 'yacht'
} as const

export const district1LocationDefinitions = {
  exploreDistrict1: {
    id: locationRegistry.EXPLORE_DISTRICT_1,
    name: 'Explore District 1',
    image: 'card_background_decor',
    stories: [
    ],
    effects: new ActivationContainer([new EnterLocationActivation(locationRegistry.EXPLORE_DISTRICT_1)])
  },

  backAlleySawbones: {
    id: locationRegistry.BACK_ALLEY_SAWBONES,
    name: 'Back Alley Sawbones',
    image: 'card_background_decor',
    stories: [
    ],
    effects: new ActivationContainer([new EnterLocationActivation(locationRegistry.BACK_ALLEY_SAWBONES)])
  },

  yacht: {
    id: locationRegistry.YACHT,
    name: 'Back Alley Sawbones',
    image: 'card_background_decor',
    stories: [
    ],
    conditionsToShow: [new NeverPrecondition()],
    effects: new ActivationContainer([new EnterLocationActivation(locationRegistry.BACK_ALLEY_SAWBONES)])
  },
} as const satisfies Record<RegistryEntityId<typeof locationRegistry>, LocationDefinition>
