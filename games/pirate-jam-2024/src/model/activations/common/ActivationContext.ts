import type { EventDefinition } from '../../definitions/eventDefinitions'
import type { CardModel } from '../../entities/CardModel'

export type ActivationContext = {
  fromEvent?: EventDefinition
  sourceCard?: CardModel
  targetCard?: CardModel
}

export type ActivationContextCard = {
  fromEvent?: EventDefinition
  sourceCard: CardModel
}

export type ActivationContextCards = {
  fromEvent?: EventDefinition
  sourceCard: CardModel
  targetCard: CardModel
}
