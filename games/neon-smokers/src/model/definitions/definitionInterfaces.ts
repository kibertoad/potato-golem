import type {
    EffectHolder, EffectsHolder,
    OptionWithPreconditions,
    RegistryEntityId,
} from '@potato-golem/core'
import type {ImageId} from "../../registries/imageRegistry";

export type MenuItem = {
    name: string
    image: ImageId
}

export type ChoiceDefinition<Registry extends Record<string, string> = Record<string, string>> = {
    id: RegistryEntityId<Registry>
    description: string
} & OptionWithPreconditions & EffectsHolder & MenuItem

export type MaybeChoicesMaybeDirect = {
    choices: ChoiceDefinition[]
    effects?: never
} | (EffectsHolder & { choices?: never })

export type StoryDefinition<Registry extends Record<string, string> = Record<string, string>> = {
    id: RegistryEntityId<Registry>
} & OptionWithPreconditions & MaybeChoicesMaybeDirect & MenuItem
