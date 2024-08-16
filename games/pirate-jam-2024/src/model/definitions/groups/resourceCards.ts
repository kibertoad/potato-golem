import {
  AnimateCardActivation,
  AnimateZoneCardsActivation,
  CancelDragCardActivation,
  DamageActivation,
  DecomposeBothCardsActivation,
  DecomposeCardActivation,
  DestroyCardActivation,
  DestroyZoneCardsActivation,
  EatCardActivation,
  FeedActivation,
  GainHealthActivation,
  LawIsDeadActivation,
  NextTurnActivation,
  QueueActivation,
  StartEventActivation,
} from '../../activations/card/cardActivations'
import { worldModel } from '../../state/WorldModel'
import { SpawnCardActivation } from '../../activations/event/extraEventActivations'
import type { CardId } from '../../registries/cardRegistry'
import type { CardDefinitionNew } from '../cardDefinitionsNew'
import { QueuedTargettedActivation } from '@potato-golem/core'
import { CombinedZonePrecondition } from '../../preconditions/CombinedZonePrecondition'
import { RoughKindPrecondition } from '../../preconditions/RoughKindPrecondition'

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
        preconditions: [
          new CombinedZonePrecondition(['streets'], 'Not a good idea to use this inside...'),
        ],
        effects: [
          new AnimateZoneCardsActivation('streets', 'blood_splat', 0),
          new DecomposeCardActivation('explosion'),
          new DestroyZoneCardsActivation('streets'),
          new NextTurnActivation(),
        ],
      },
    },
  },

  HEALTH: {
    id: 'HEALTH',
    name: 'Health',
    image: 'health_card',
    zoneCombinationEffect: {
      homunculus: {
        tooltip: `Sacrifices must be made...`,
        effect: [
          new EatCardActivation(),
          new GainHealthActivation(worldModel.homunculusModel, 1),
          new FeedActivation(worldModel.homunculusModel, 3, true),
          new NextTurnActivation(),
        ],
      },
    },
  },

  FOOD: {
    id: 'FOOD',
    name: 'Food',
    image: 'food_card',
    zoneCombinationEffect: {
      homunculus: {
        effect: [
          new EatCardActivation(),
          new GainHealthActivation(worldModel.homunculusModel, 1),
          new FeedActivation(worldModel.homunculusModel, 1, true),
          new NextTurnActivation(),
        ],
      },
    },
  },

  POISON: {
    id: 'POISON',
    name: 'Poison',
    image: 'poison_card',
    zoneCombinationEffect: {
      homunculus: {
        tooltip: `I wonder if it is immune...`,
        effect: [
          new EatCardActivation(),
          new DamageActivation(worldModel.homunculusModel, 1),
          new SpawnCardActivation(
            {
              zone: 'home',
              cardId: 'WATCHING_FLOWER',
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
      THE_LAW: {
        tooltip: `He is too nosy for his own good...`,
        preconditions: [
          new CombinedZonePrecondition(
            ['home', 'alchemy', 'lab'],
            "Not sure it's wise to try this on the street",
          ),
        ],
        effects: [
          new SpawnCardActivation(
            {
              zone: 'any',
              cardId: 'CORPSE',
              amount: 1,
              description: "Maybe if I offer him a drink, he won't notice anything",
            },
            0,
            'same_as_combined',
          ),
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ],
      },

      THE_ROUGH_KIND: {
        tooltip: `They are ruining my carpet.`,
        preconditions: [
          new CombinedZonePrecondition(
            ['home', 'alchemy', 'lab'],
            "Not sure it's wise to try this on the street",
          ),
        ],
        effects: [
          new SpawnCardActivation(
            {
              zone: 'any',
              cardId: 'CORPSE',
              amount: 1,
              description: '',
            },
            0,
            'same_as_combined',
          ),
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ],
      },
    },
  },

  GOLD: {
    id: 'GOLD',
    name: 'Gold',
    image: 'gold_card',
    cardCombinationEffect: {
      MERCHANT: {
        effects: [
          new DecomposeCardActivation(),
          new StartEventActivation('SHOPKEEPER'),
          new QueueActivation(
            new QueuedTargettedActivation({
              id: 'SPAWN_ROUGH_KIND',
              unique: true,
              description: 'May attract attention',
              activatesIn: 1,
              activations: [new SpawnCardActivation(
                {
                  zone: 'streets',
                  precondition: new RoughKindPrecondition(),
                  cardId: 'THE_ROUGH_KIND',
                  description: '',
                  spawnAnimation: 'fly_in_left',
                },
                -1,
                'zone',
                true,
              )],
            }),
          ),
        ],
      },

      THE_LAW: {
        tooltip: `It's not a bribe if it's a donation...`,
        effects: [
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ],
      },

      THE_ROUGH_KIND: {
        tooltip: `Take it and leave me alone already!`,
        effects: [
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ],
      },
    },
  },

  SINGING_MUSHROOMS: {
    id: 'SINGING_MUSHROOMS',
    name: 'Singing Mushrooms',
    image: 'singing_mushrooms_card',

    zoneCombinationEffect: {
      homunculus: {
        effect: [
          new EatCardActivation(),
          new FeedActivation(worldModel.homunculusModel, 1, true),
          new NextTurnActivation(),
        ],
      },
    },
  },

  MONEY: {
    id: 'MONEY',
    name: 'Money',
    image: 'money_card',
    cardCombinationEffect: {
      MERCHANT: {
        effects: [
          new DecomposeCardActivation(),
          new StartEventActivation('SHOPKEEPER'),
        ],
      },

      THE_LAW: {
        tooltip: `It's not a bribe if it's a donation...`,
        effects: [
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ],
      },

      THE_ROUGH_KIND: {
        tooltip: `Take it and leave me alone already!`,
        effects: [
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ],
      },
    },
  },

  MEDICINE: {
    id: 'MEDICINE',
    name: 'Medicne',
    image: 'medicine_card',
    // idleZoneEffect: {
    //   home: {
    //     timeTillTrigger: 1,
    //     effect: new DescribedTargettedAsyncMultiplexActivation([
    //       new SpawnCardActivation(eventSink, {
    //         spawnAnimation: 'pop_in',
    //         description: 'Spawn 1 Health',
    //         cardId: 'HEALTH',
    //         zone: 'home',
    //       }),
    //       new DecomposeCardActivation(),
    //     ]),
    //   },
    // },
    cardCombinationEffect: {
      HEALTH: {
        tooltip: `This won't hurt a bit`,
        effects: [
          new CancelDragCardActivation('HEALTH'),
          new AnimateCardActivation('poof', 0),
          new SpawnCardActivation( {
            zone: 'home',
            cardId: 'HEALTH',
            amount: 1,
            description: 'Get 1 Health',
          }),
          new DestroyCardActivation(),
          new NextTurnActivation(),
        ],
      },
    },
  },

  CORPSE: {
    id: 'CORPSE',
    image: 'corpse_card',
    name: 'Corpse',

    zoneCombinationEffect: {
      homunculus: {
        tooltip: 'I need to get rid of the evidence',
        effect: [
          new EatCardActivation(),
          new FeedActivation(worldModel.homunculusModel, 1),
          new SpawnCardActivation(
            {
              zone: 'alchemy',
              cardId: 'ENLIGHTENED_MANDRAKE',
              amount: 2,
              description: '',
              spawnAnimation: 'pop_in',
            },
            0,
          ),
          new NextTurnActivation(),
        ],
      },
    },
  },
} as const satisfies Partial<Record<CardId, CardDefinitionNew>>
