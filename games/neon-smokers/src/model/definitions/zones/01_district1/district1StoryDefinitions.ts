import { ImageId } from '../../../../registries/imageRegistry'
import { ActivationContainer, Precondition, RegistryEntityId } from '@potato-golem/core'
import { ChoiceDefinition, choiceRegistry } from './district1ChoiceDefinitions'
import { StartStoryActivation } from '../../activations/activations'
import { EndStoryActivation } from '../../../activations/EndStoryActivation'

export const storyRegistry = {
  EXPLORE_DISTRICT_1: 'exploreDistrict1',
} as const

export type StoryDefinition = {
  id: RegistryEntityId<typeof storyRegistry>
  name: string
  image: ImageId
  choices: ChoiceDefinition[]
}

export const district1StoryDefinitions = {
  exploreDistrict1: {
    id: 'exploreDistrict1',
    name: 'Explore District 1',
    image: 'card_background_decor',
    choices: [{
      id: 'careful',
      name: 'Careful exploration',
      description: 'Take your time, leave no traces',
      image: 'card_background_decor',
      effects: ActivationContainer.instance()
        .add(new EndStoryActivation())
    }]
  },
} as const satisfies Record<RegistryEntityId<typeof storyRegistry>, StoryDefinition>
