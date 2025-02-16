import { ZoneBundle } from '../common/ZoneBundle'
import { district1ChoiceDefinitions } from './district1ChoiceDefinitions'
import { district1StoryDefinitions } from './district1StoryDefinitions'

export const district1Bundle = {
  id: 'district1',
  name: 'District 1',
  globalChoices: district1ChoiceDefinitions,
  zoneStories: district1StoryDefinitions,
} satisfies ZoneBundle
