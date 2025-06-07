import { RegistryEntityId } from '@potato-golem/core'
\import { LocationDefinition } from './LocationDefinition'
import {StoryDefinition} from "../../definitionInterfaces";

export const zoneRegistry = {
  Cattery: 'cattery',
  RecentYork: 'recent_york', // human town
  SprocketForest: 'sprocket_forest',
  GrayBeach: 'gray_beach',
  BigBlue: 'big_blue',
  Junkyard: 'junkyard',
  Labyrinth: 'labyrinth'
} as const

export type ZoneBundle = {
  id: RegistryEntityId<typeof zoneRegistry>
  name: string
  zoneStories: Record<string, StoryDefinition>
  zoneLocations: Record<string, LocationDefinition>
}
