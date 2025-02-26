import type { ImageId } from '../../../../registries/imageRegistry'
import {MenuItem, StoryDefinition} from "../../definitionInterfaces";
import {EffectHolder, OptionWithPreconditions} from "@potato-golem/core";

export type LocationDefinition = {
  id: string
  stories: StoryDefinition[]
} & MenuItem & OptionWithPreconditions & EffectHolder
