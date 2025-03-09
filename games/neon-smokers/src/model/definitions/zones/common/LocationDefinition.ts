import type {MenuItem, StoryDefinition} from "../../definitionInterfaces";
import type {EffectHolder, OptionWithPreconditions} from "@potato-golem/core";

export type LocationDefinition = {
  id: string
  stories: StoryDefinition[]
} & MenuItem & OptionWithPreconditions & Partial<EffectHolder>
