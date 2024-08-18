import {
  DecomposeOtherCardActivation,
  StartEventActivation,
} from '../../activations/card/cardActivations'
import type { PossibleCardEffects } from '../cardDefinitionTypes'
import type { EventId } from '../eventDefinitions'

export type MultiOptionCraftingActivationParams = {
  eventName: EventId
}

export function createMultiOptionCraftingActivation(
  params: MultiOptionCraftingActivationParams,
): PossibleCardEffects {
  return [new DecomposeOtherCardActivation('poof', 200), new StartEventActivation(params.eventName)]
}
