import { ZoneBundle } from '../common/ZoneBundle'
import { district1ChoiceDefinitions } from './district1ChoiceDefinitions'
import { district1StoryDefinitions } from './district1StoryDefinitions'
import {district1LocationDefinitions} from "./district1LocationDefinitions";

export const district1Bundle = {
  id: 'district1',
  name: 'District 1',
  zoneStories: district1StoryDefinitions,
  zoneLocations: district1LocationDefinitions,
} satisfies ZoneBundle
