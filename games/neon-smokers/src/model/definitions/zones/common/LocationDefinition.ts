import type {MenuItem, StoryDefinition} from "../../definitionInterfaces";
import type { EffectsHolder, OptionWithPreconditions } from '@potato-golem/core'

export type LocationDefinition = {
  id: string
  stories: StoryDefinition[]
} & MenuItem & OptionWithPreconditions & Partial<EffectsHolder>
