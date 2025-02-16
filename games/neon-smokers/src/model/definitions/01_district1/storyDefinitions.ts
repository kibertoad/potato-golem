import { ImageId } from '../../../registries/imageRegistry'
import { ActivationContainer, Precondition, RegistryEntityId } from '@potato-golem/core'
import { ChoiceDefinition, choiceRegistry } from './choiceDefinitions'
import { StartStoryActivation } from '../../activations/activations'

export const storyRegistry = {
  EXPLORE_DISTRICT_1: 'exploreDistrict1',
} as const

export type StoryDefinition = {
  id: RegistryEntityId<typeof storyRegistry>
  name: string
  image: ImageId
  choices: ChoiceDefinition[]
}

export const storyDefinitions = {
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
        .add(new StartStoryActivation(storyRegistry.EXPLORE_DISTRICT_1))
    }]
  },
} as const satisfies Record<RegistryEntityId<typeof storyRegistry>, StoryDefinition>
