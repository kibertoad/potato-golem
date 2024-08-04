import {
  AnimateZoneCardsActivation,
  DamageActivation, DecomposeBothCardsActivation, DecomposeCardActivation, DestroyZoneCardsActivation,
  EatCardActivation,
  FeedActivation, LawIsDeadActivation,
  NextTurnActivation,
} from '../../activations/card/cardActivations'
import { worldModel } from '../../state/WorldModel'
import { SpawnCardActivation } from '../../activations/event/extraEventActivations'
import type { CardId } from '../../registries/cardRegistry'
import type { CardDefinitionNew } from '../cardDefinitionsNew'
import type { BoardSupportedEvents } from '../../../scenes/board/BoardScene'
import { EventEmitters } from '../../registries/eventEmitterRegistry'
import { DescribedTargettedAsyncMultiplexActivation, EventSink } from '@potato-golem/core'
import { CombinedZonePrecondition } from '../../preconditions/CombinedZonePrecondition'

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
        effects: [new DecomposeBothCardsActivation()],
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
        effects: [
          new SpawnCardActivation(
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

  WATCHING_FLOWER: {
    id: 'WATCHING_FLOWER',
    name: 'Watching Flower',
    image: 'watching_flower_card',
  },

  ENLIGHTENED_MANDRAKE: {
    id: 'ENLIGHTENED_MANDRAKE',
    name: 'Enlightened Mandrake',
    image: 'enlightened_mandrake_card',
  },

  DAYDREAM: {
    id: 'DAYDREAM',
    name: 'Daydream',
  },

  EXPLOSIVES: {
    id: 'EXPLOSIVES',
    name: 'Explosives',
    image: 'explosives_card',
    cardCombinationEffect: {
      THE_ROUGH_KIND: {
        tooltip: `Hopefully they will use it wisely`,
        effects: [
          new SpawnCardActivation(
            {
              zone: 'home',
              cardId: 'MONEY',
              amount: 2,
              description: 'Get some money',
              spawnAnimation: 'pop_in',
            },
            0,
          ),
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ],
      },

      THE_LAW: {
        preconditions: [
          new CombinedZonePrecondition(['streets'], 'Not a good idea to use this inside...'),
        ],
        effects: [
          new AnimateZoneCardsActivation('streets', 'blood_splat', 0),
          new DecomposeCardActivation('explosion'),
          new DestroyZoneCardsActivation('streets'),
          new LawIsDeadActivation(),
          new NextTurnActivation(),
        ],
      },

      THE_RAID: {
        timeTillTrigger: 0,
        preconditions: [
          new CombinedZonePrecondition(['streets'], 'Not a good idea to use this inside...'),
        ],
        effect: new DescribedTargettedAsyncMultiplexActivation([
          new AnimateZoneCardsActivation('streets', 'blood_splat', 0),
          new DecomposeCardActivation('explosion'),
          new DestroyZoneCardsActivation('streets'),
          new NextTurnActivation(),
        ]),
      },
    },
  },
} as const satisfies Partial<Record<CardId, CardDefinitionNew>>
