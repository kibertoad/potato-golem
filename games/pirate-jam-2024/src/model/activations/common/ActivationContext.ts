import type { EventDefinition } from '../../definitions/eventDefinitions'
import type { CardModel } from '../../entities/CardModel'

export type ActivationContext = {
  fromEvent?: EventDefinition
  sourceCard?: never
  targetCard?: CardModel
}

export type ActivationContextEvent = {
  fromEvent?: EventDefinition
  sourceCard?: never
  targetCard?: never
}

export type ActivationContextSingleCard = {
  fromEvent?: EventDefinition
  targetCard: CardModel
}

export type ActivationContextCardCombo = {
  fromEvent?: never
  sourceCard: CardModel
  targetCard: CardModel
}
