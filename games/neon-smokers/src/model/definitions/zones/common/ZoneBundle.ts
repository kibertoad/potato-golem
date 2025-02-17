import { RegistryEntityId } from '@potato-golem/core'
import { ChoiceDefinition, choiceRegistry } from '../01_district1/district1ChoiceDefinitions'
import { StoryDefinition } from '../01_district1/district1StoryDefinitions'
import { LocationDefinition } from './LocationDefinition'

export const zoneRegistry = {
  DISTRICT_1: 'district1',
} as const

export type ZoneBundle = {
  id: RegistryEntityId<typeof zoneRegistry>
  name: string
  globalChoices: Record<string, ChoiceDefinition>
  zoneStories: Record<string, StoryDefinition>
  zoneLocations: Record<string, LocationDefinition>
}
