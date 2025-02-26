import { ImageId } from '../../../../registries/imageRegistry'
import { ActivationContainer, Precondition, RegistryEntityId } from '@potato-golem/core'
import { storyRegistry } from './district1StoryDefinitions'
import { StartStoryActivation } from '../../../activations/StartStoryActivation'
import {ChoiceDefinition} from "../../definitionInterfaces";

export const choiceRegistry = {
  EXPLORE_DISTRICT_1: 'exploreDistrict1',
} as const

export const district1ChoiceDefinitions = {
  exploreDistrict1: {
    id: choiceRegistry.EXPLORE_DISTRICT_1,
    name: 'Explore District 1',
    description: 'Might as well understand where you are',
    image: 'card_background_decor',
    effects: ActivationContainer.instance()
      .add(new StartStoryActivation(storyRegistry.EXPLORE_DISTRICT_1))
  },
} as const satisfies Record<RegistryEntityId<typeof choiceRegistry>, ChoiceDefinition>
