import { RegistryEntityId } from '@potato-golem/core'
\import { LocationDefinition } from './LocationDefinition'
import {StoryDefinition} from "../../definitionInterfaces";

export const zoneRegistry = {
  DISTRICT_1: 'district1',
} as const

export type ZoneBundle = {
  id: RegistryEntityId<typeof zoneRegistry>
  name: string
  zoneStories: Record<string, StoryDefinition>
  zoneLocations: Record<string, LocationDefinition>
}
