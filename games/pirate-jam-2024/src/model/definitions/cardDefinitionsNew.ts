import type { CardId } from '../registries/cardRegistry'
import { resourceCardDefinitions } from './groups/resourceCards'
import { propertyCardDefinitions } from './groups/propertyCards'
import { creatureCardDefinitions } from './groups/creaturesCards'
import type { CardDefinitionNew } from './cardDefinitionTypes'

export type CardDefinitions = typeof cardDefinitions

export const cardDefinitions = {
  ...resourceCardDefinitions,
  ...propertyCardDefinitions,
  ...creatureCardDefinitions
} as const satisfies Record<CardId, CardDefinitionNew>
