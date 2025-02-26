import {
    ActivationContainer,
    EffectHolder,
    OptionWithPreconditions,
    Precondition,
    RegistryEntityId
} from "@potato-golem/core";
import {ImageId} from "../../registries/imageRegistry";
import {storyRegistry} from "./zones/01_district1/district1StoryDefinitions";

export type MenuItem = {
    name: string
    image: ImageId
}

export type ChoiceDefinition<Registry extends Record<string, string> = Record<string, string>> = {
    id: RegistryEntityId<Registry>
    description: string
} & OptionWithPreconditions & EffectHolder & MenuItem

export type StoryDefinition<Registry extends Record<string, string> = Record<string, string>> = {
    id: RegistryEntityId<Registry>
    choices: ChoiceDefinition[]
} & OptionWithPreconditions & MenuItem
