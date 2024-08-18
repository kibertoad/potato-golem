import type { CardId } from '../registries/cardRegistry'
import type { CardDefinitionNew } from './cardDefinitionTypes'
import { creatureCardDefinitions } from './groups/creaturesCards'
import { propertyCardDefinitions } from './groups/propertyCards'
import { resourceCardDefinitions } from './groups/resourceCards'

export type CardDefinitions = typeof cardDefinitions

export const cardDefinitions = {
  ...resourceCardDefinitions,
  ...propertyCardDefinitions,
  ...creatureCardDefinitions,
} as const satisfies Record<CardId, CardDefinitionNew>
