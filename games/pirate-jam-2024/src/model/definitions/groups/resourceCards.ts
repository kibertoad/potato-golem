import {
  DamageActivation, DecomposeBothCardsActivation,
  EatCardActivation,
  FeedActivation,
  NextTurnActivation,
} from '../../activations/card/cardActivations'
import { worldModel } from '../../state/WorldModel'
import { SpawnCardActivation } from '../../activations/event/extraEventActivations'
import type { CardId } from '../../registries/cardRegistry'
import type { CardDefinitionNew } from '../cardDefinitionsNew'
import type { BoardSupportedEvents } from '../../../scenes/board/BoardScene'
import { EventEmitters } from '../../registries/eventEmitterRegistry'
import type { EventSink } from '@potato-golem/core'

const eventSink: EventSink<BoardSupportedEvents> = EventEmitters.boardEventEmitter

export const resourceCardDefinitions = {
  ABSINTHE: {
    id: 'ABSINTHE',
    name: 'Absinthe',
    image: 'booze_card',
    zoneCombinationEffect: {
      homunculus: {
        tooltip: `This stuff is expensive... I hope it will be worth it...`,
        effect: [
          new EatCardActivation(),
          new DamageActivation(worldModel.homunculusModel, 1),
          new FeedActivation(worldModel.homunculusModel, 1),
          new SpawnCardActivation(
            eventSink,
            {
              zone: 'home',
              cardId: 'GOLD',
              amount: 1,
              description: '',
            },
            0,
            'same_as_combined',
          ),
          new NextTurnActivation(),
        ],
      },
    },
    cardCombinationEffect: {
      THE_ROUGH_KIND: {
        effect: [new DecomposeBothCardsActivation()],
      },
    },
  },

  MOLD: {
    id: 'MOLD',
    name: 'Mold',
    image: 'poison_mold_card',
    cardCombinationEffect: {
      ALCHEMICAL_SUPPLIES: {
        tooltip: `Make sure to keep fire away from this stuff`,
        effect: [
          new SpawnCardActivation(
            eventSink,
            {
              cardId: 'EXPLOSIVES', // replace with explosives
              description: 'Create 1 Explosives',
              zone: 'lab',
            },
            0,
          ),
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ],
      },
    },
  },

  ALCHEMICAL_SUPPLIES: {
    id: 'ALCHEMICAL_SUPPLIES',
    image: 'alchemical_supplies_card',
    name: 'Alchemical supplies',
  },


} as const satisfies Partial<Record<CardId, CardDefinitionNew>>
