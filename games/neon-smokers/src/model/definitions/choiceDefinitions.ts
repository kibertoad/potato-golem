import { ImageId } from '../../registries/imageRegistry'

export const choiceRegistry = {
  EXPLORE_DISTRICT_1: 'exploreDistrict1',
} as const

export type ChoiceDefinition = {
  id: string
  name: string
  image: ImageId
}

export type ChoiceId = (typeof choiceRegistry)[keyof typeof choiceRegistry]

export const choiceDefinitions = {
  exploreDistrict1: {
    id: 'exploreDistrict1',
    name: 'Explore District 1',
    image: 'card_background_decor'
  },
} as const satisfies Record<ChoiceId, ChoiceDefinition>
