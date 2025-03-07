import { ActivationContainer, type EventSink, QueuedTargettedActivation } from '@potato-golem/core'
import type { Precondition } from '@potato-golem/core'
import type { TargettedPrecondition } from '@potato-golem/core'
import type { Position } from '@potato-golem/ui'
import type { TargettedReasonedPrecondition } from '../../../../../packages/core/src/core/preconditions/Precondition'
import type { BoardSupportedEvents } from '../../scenes/board/BoardScene'
import {
  AnimateCardActivation,
  AnimateZoneCardsActivation,
  AttackHomunculusCardActivation,
  CancelDragCardActivation,
  ChatCardActivation,
  DamageActivation,
  DecomposeBothCardsActivation,
  DecomposeCardActivation,
  DecomposeOtherCardActivation,
  DestroyCardActivation,
  DestroyZoneCardsActivation,
  EatCardActivation,
  FeedActivation,
  GainHealthActivation,
  LawIsDeadActivation,
  MoveToZoneCardActivation,
  NextTurnActivation,
  QueueActivation,
  SearchAndDecideCardActivation,
  SearchAndDestroyCardActivation,
  SetActiveCardActivation,
  StartEventActivation,
  TheLawMoveActivation,
} from '../activations/card/cardActivations'
import type { ActivationContext } from '../activations/common/ActivationContext'
import { SpawnCardActivation } from '../activations/event/extraEventActivations'
import { CheckIfActiveCardPrecondition } from '../preconditions/CheckIfActiveCardPrecondition'
import { CombinedZonePrecondition } from '../preconditions/CombinedZonePrecondition'
import { RoughKindPrecondition } from '../preconditions/RoughKindPrecondition'
import type { CardId } from '../registries/cardRegistry'
import { EventEmitters } from '../registries/eventEmitterRegistry'
import type { ImageId } from '../registries/imageRegistry'
import { type SfxEvent, SfxEventRegistry } from '../registries/sfxEventRegistry'
import type { Zone } from '../registries/zoneRegistry'
import { worldModel } from '../state/WorldModel'

export type CardEffectDefinition = {
  timeTillTrigger: number
  tooltip?: string
  preconditions?: Array<
    | Precondition
    | TargettedPrecondition<ActivationContext>
    | TargettedReasonedPrecondition<ActivationContext>
  >
  effect: ActivationContainer<ActivationContext>
}

export type CardDefinition = {
  id: CardId
  name: string
  image?: ImageId
  activeImage?: ImageId
  activateSfx?: SfxEvent
  deactivateSfx?: SfxEvent
  nonDraggable?: boolean
  chatBubbleOrigin?: Position
  chatBubbleRightOffset?: number
  spawnPhrases?: string[]

  // Effect that is triggered after card staying within a zone for a while
  idleZoneEffect?: Partial<Record<Zone, CardEffectDefinition>>

  cardCombinationEffect?: Partial<Record<CardId, CardEffectDefinition>>
}

export type CardDefinitions = typeof cardDefinitions

const eventSink: EventSink<BoardSupportedEvents> = EventEmitters.boardEventEmitter

export const cardDefinitions = {
  ABSINTHE: {
    id: 'ABSINTHE',
    name: 'Absinthe',
    image: 'booze_card',
    idleZoneEffect: {
      homunculus: {
        timeTillTrigger: 0,
        tooltip: `This stuff is expensive...I hope it will be worth it...`,
        effect: new ActivationContainer([
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
        ]),
      },
    },
    cardCombinationEffect: {
      THE_ROUGH_KIND: {
        timeTillTrigger: 0,
        effect: new ActivationContainer([new DecomposeBothCardsActivation()]),
      },
    },
  },

  MOLD: {
    id: 'MOLD',
    name: 'Mold',
    image: 'poison_mold_card',
    cardCombinationEffect: {
      ALCHEMICAL_SUPPLIES: {
        timeTillTrigger: 0,
        tooltip: `Make sure to keep fire away from this stuff`,
        effect: new ActivationContainer([
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
        ]),
      },
    },
  },

  ALCHEMICAL_SUPPLIES: {
    id: 'ALCHEMICAL_SUPPLIES',
    image: 'alchemical_supplies_card',
    name: 'Alchemical supplies',
  },

  WORKBENCH: {
    id: 'WORKBENCH',
    name: 'Workbench',
    image: 'workbench_card',
    activeImage: 'workbench_card_on',
    activateSfx: SfxEventRegistry.LIGHT_UP,
    deactivateSfx: SfxEventRegistry.PUT_OUT,
    nonDraggable: true,
    cardCombinationEffect: {
      MOLD: {
        timeTillTrigger: 0,
        preconditions: [new CheckIfActiveCardPrecondition(false, `It's already cooking`)],
        tooltip: `I bet I can make something more potent with this`,
        effect: new ActivationContainer([
          new QueueActivation(
            new QueuedTargettedActivation({
              id: 'WORKBENCH_COOK_POISON',
              unique: true,
              description: 'Need to let it simmer',
              activatesIn: 1,
              activations: [
                new SetActiveCardActivation(false),
                // new PlaySfxActivation([SfxRegistry.POOF]),
                new SpawnCardActivation({
                  cardId: 'POISON', // replace with explosives
                  description: 'Create 1 Poison',
                  zone: 'lab',
                }),
              ],
            }),
          ),
          new DecomposeOtherCardActivation('poof', 300),
          new SetActiveCardActivation(true),
        ]),
      },
      SINGING_MUSHROOMS: {
        timeTillTrigger: 0,
        preconditions: [new CheckIfActiveCardPrecondition(false, `It's already cooking`)],
        tooltip: `I think I can make something out of this`,
        effect: new ActivationContainer([
          new DecomposeOtherCardActivation('poof', 200),
          new StartEventActivation('CRAFT_MUSHROOMS'),
        ]),
      },
      ALCHEMICAL_SUPPLIES: {
        timeTillTrigger: 0,
        preconditions: [new CheckIfActiveCardPrecondition(false, `It's already cooking`)],
        tooltip: `Options are limitless`,
        effect: new ActivationContainer([
          new DecomposeOtherCardActivation('poof', 200),
          new StartEventActivation('CRAFT_SUPPLIES'),
        ]),
      },
      WATCHING_FLOWER: {
        timeTillTrigger: 0,
        preconditions: [new CheckIfActiveCardPrecondition(false, `It's already cooking`)],
        effect: new ActivationContainer([
          new DecomposeOtherCardActivation('poof', 200),
          new StartEventActivation('CRAFT_FLOWERS'),
        ]),
      },
      ENLIGHTENED_MANDRAKE: {
        timeTillTrigger: 0,
        preconditions: [new CheckIfActiveCardPrecondition(false, `It's already cooking`)],
        effect: new ActivationContainer([
          new DecomposeOtherCardActivation('poof', 200),
          new StartEventActivation('CRAFT_MANDRAKE'),
        ]),
      },
    },
  },

  PORTAL: {
    id: 'PORTAL',
    name: 'Portal',
    image: 'portal_card',
    nonDraggable: true,
  },

  THE_ID: {
    id: 'THE_ID',
    image: 'the_id_card',
    name: 'The Id',
    nonDraggable: true,
  },

  SINGING_MUSHROOMS: {
    id: 'SINGING_MUSHROOMS',
    name: 'Singing Mushrooms',
    image: 'singing_mushrooms_card',

    idleZoneEffect: {
      homunculus: {
        timeTillTrigger: 0,
        effect: new ActivationContainer([
          new EatCardActivation(),
          new FeedActivation(worldModel.homunculusModel, 1, true),
          new NextTurnActivation(),
        ]),
      },
    },
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

  SHADOW_MUSE: {
    id: 'SHADOW_MUSE',
    image: 'shadow_muse_card',
    name: 'Shadow Muse',
    nonDraggable: true,
  },

  SONECHKA: {
    id: 'SONECHKA',
    name: 'Sonechka',
    image: 'sonechka_card',
    nonDraggable: true,
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
        timeTillTrigger: 0,
        tooltip: `Hopefully they will use it wisely`,
        effect: new ActivationContainer([
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
        ]),
      },

      THE_LAW: {
        timeTillTrigger: 0,
        preconditions: [
          new CombinedZonePrecondition(['streets'], 'Not a good idea to use this inside...'),
        ],
        effect: new ActivationContainer([
          new AnimateZoneCardsActivation('streets', 'blood_splat', 0),
          new DecomposeCardActivation('explosion'),
          new DestroyZoneCardsActivation('streets'),
          new LawIsDeadActivation(),
          new NextTurnActivation(),
        ]),
      },

      THE_RAID: {
        timeTillTrigger: 0,
        preconditions: [
          new CombinedZonePrecondition(['streets'], 'Not a good idea to use this inside...'),
        ],
        effect: new ActivationContainer([
          new AnimateZoneCardsActivation('streets', 'blood_splat', 0),
          new DecomposeCardActivation('explosion'),
          new DestroyZoneCardsActivation('streets'),
          new NextTurnActivation(),
        ]),
      },
    },
  },

  HEALTH: {
    id: 'HEALTH',
    name: 'Health',
    image: 'health_card',
    idleZoneEffect: {
      homunculus: {
        timeTillTrigger: 0,
        tooltip: `Sacrifices must be made...`,
        effect: new ActivationContainer([
          new EatCardActivation(),
          new GainHealthActivation(worldModel.homunculusModel, 1),
          new FeedActivation(worldModel.homunculusModel, 3, true),
          new NextTurnActivation(),
        ]),
      },
    },
  },

  FOOD: {
    id: 'FOOD',
    name: 'Food',
    image: 'food_card',
    idleZoneEffect: {
      homunculus: {
        timeTillTrigger: 0,
        effect: new ActivationContainer([
          new EatCardActivation(),
          new GainHealthActivation(worldModel.homunculusModel, 1),
          new FeedActivation(worldModel.homunculusModel, 1, true),
          new NextTurnActivation(),
        ]),
      },
    },
  },

  POISON: {
    id: 'POISON',
    name: 'Poison',
    image: 'poison_card',
    idleZoneEffect: {
      homunculus: {
        timeTillTrigger: 0,
        tooltip: `I wonder if it is immune...`,
        effect: new ActivationContainer([
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
        ]),
      },
    },
    cardCombinationEffect: {
      THE_LAW: {
        timeTillTrigger: 0,
        tooltip: `He is too nosy for his own good...`,
        preconditions: [
          new CombinedZonePrecondition(
            ['home', 'alchemy', 'lab'],
            "Not sure it's wise to try this on the street",
          ),
        ],
        effect: new ActivationContainer([
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
        ]),
      },

      THE_ROUGH_KIND: {
        timeTillTrigger: 0,
        tooltip: `They are ruining my carpet.`,
        preconditions: [
          new CombinedZonePrecondition(
            ['home', 'alchemy', 'lab'],
            "Not sure it's wise to try this on the street",
          ),
        ],
        effect: new ActivationContainer([
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
        ]),
      },
    },
  },

  GOLD: {
    id: 'GOLD',
    name: 'Gold',
    image: 'gold_card',
    cardCombinationEffect: {
      MERCHANT: {
        timeTillTrigger: 0,
        effect: new ActivationContainer([
          new DecomposeCardActivation(),
          new StartEventActivation('SHOPKEEPER'),
          new QueueActivation(
            new QueuedTargettedActivation({
              id: 'SPAWN_ROUGH_KIND',
              unique: true,
              description: 'May attract attention',
              activatesIn: 1,
              activations: [
                new SpawnCardActivation(
                  {
                    zone: 'streets',
                    precondition: new RoughKindPrecondition(),
                    cardId: 'THE_ROUGH_KIND',
                    description: '',
                    spawnAnimation: 'fly_in_left',
                  },
                  -1,
                  'zone',
                ),
              ],
            }),
          ),
        ]),
      },

      THE_LAW: {
        timeTillTrigger: 0,
        tooltip: `It's not a bribe if it's a donation...`,
        effect: new ActivationContainer([
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ]),
      },

      THE_ROUGH_KIND: {
        timeTillTrigger: 0,
        tooltip: `Take it and leave me alone already!`,
        effect: new ActivationContainer([
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ]),
      },
    },
  },

  MONEY: {
    id: 'MONEY',
    name: 'Money',
    image: 'money_card',
    cardCombinationEffect: {
      MERCHANT: {
        timeTillTrigger: 0,
        effect: new ActivationContainer([
          new DecomposeCardActivation(),
          new StartEventActivation('SHOPKEEPER'),
        ]),
      },

      THE_LAW: {
        timeTillTrigger: 0,
        tooltip: `It's not a bribe if it's a donation...`,
        effect: new ActivationContainer([
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ]),
      },

      THE_ROUGH_KIND: {
        timeTillTrigger: 0,
        tooltip: `Take it and leave me alone already!`,
        effect: new ActivationContainer([
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ]),
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
    //     effect: new DescribedTargettedMultipleActivation([
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
        timeTillTrigger: 0,
        tooltip: `This won't hurt a bit`,
        effect: new ActivationContainer([
          new CancelDragCardActivation('HEALTH'),
          new AnimateCardActivation('poof', 0),
          new SpawnCardActivation({
            zone: 'home',
            cardId: 'HEALTH',
            amount: 1,
            description: 'Get 1 Health',
          }),
          new DestroyCardActivation(),
          new NextTurnActivation(),
        ]),
      },
    },
  },

  // People

  MERCHANT: {
    id: 'MERCHANT',
    name: 'Merchant',
    image: 'merchant_card',
    nonDraggable: true,
    chatBubbleOrigin: { x: 80, y: 80 },
  },

  BLACK_WIDOW: {
    id: 'BLACK_WIDOW',
    name: 'Black Widow',
    nonDraggable: true,
  },

  SURGEON: {
    id: 'SURGEON',
    name: 'Surgeon',
    nonDraggable: true,
  },

  THE_RAID: {
    id: 'THE_RAID',
    name: 'The Raid',
    image: 'the_raid_card',
    nonDraggable: true,
  },

  THE_LAW: {
    id: 'THE_LAW',
    name: 'The Law',
    image: 'the_law_card',
    nonDraggable: true,
    chatBubbleOrigin: { x: 80, y: 85 },
    chatBubbleRightOffset: 42,
    spawnPhrases: [
      'Police! Open up!',
      'We had a report on this place.',
      'What is going on here?',
      'Stop right there!',
    ],
    idleZoneEffect: {
      any: {
        timeTillTrigger: 1,
        effect: new ActivationContainer([new TheLawMoveActivation()]),
      },
    },
  },

  THE_ROUGH_KIND: {
    id: 'THE_ROUGH_KIND',
    image: 'rough_kind_card',
    name: 'The Rough Kind',
    nonDraggable: true,
    chatBubbleOrigin: { x: 68, y: 125 },
    chatBubbleRightOffset: 30,
    spawnPhrases: ['Well hello there!', 'Now this place looks antiquish!'],
    idleZoneEffect: {
      streets: {
        timeTillTrigger: 1,
        effect: new ActivationContainer([
          new SearchAndDecideCardActivation(
            ['THE_LAW', 'THE_RAID'],
            'any',
            [
              new ChatCardActivation(['Cops! Run!', 'Oh no, not the cops!']),
              new DecomposeCardActivation(),
            ],
            [
              new ChatCardActivation([
                'Okay boys, turn this place upside down!',
                "Let's check this place out!",
              ]),
              new MoveToZoneCardActivation(worldModel, ['home']),
            ],
          ),
        ]),
      },
      home: {
        timeTillTrigger: 1,
        effect: new ActivationContainer([
          new SearchAndDecideCardActivation(
            ['THE_LAW', 'THE_RAID'],
            'any',
            [
              new ChatCardActivation(['Cops! Run!', `Oh no, it's the cops!`]),
              new DecomposeCardActivation(),
            ],
            [
              new SearchAndDecideCardActivation(
                ['GOLD', 'MONEY'],
                'home',
                [
                  new ChatCardActivation([
                    "Now that's what I'm talking about!",
                    'Cha-ching!',
                    'Oooo...shiny!',
                    'If it sparkles or glows, it goes in the bag!',
                  ]),
                  new SearchAndDestroyCardActivation(['GOLD', 'MONEY'], 'home', false),
                ],
                [
                  new ChatCardActivation(['Keep looking!', 'There has to be something...']),
                  new MoveToZoneCardActivation(worldModel, ['alchemy']),
                ],
              ),
            ],
          ),
        ]),
      },
      alchemy: {
        timeTillTrigger: 1,
        effect: new ActivationContainer([
          new SearchAndDecideCardActivation(
            ['THE_LAW', 'THE_RAID'],
            'any',
            [
              new ChatCardActivation(['Cops! Run!', `Oh no, it's the cops!`]),
              new DecomposeCardActivation(),
            ],
            [
              new ChatCardActivation([
                'What the hell is this?!',
                'Get him boys!',
                'Get it off me!',
              ]),
              new AttackHomunculusCardActivation(worldModel.homunculusModel, 1, false),
            ],
          ),
        ]),
      },
    },
  },

  CORPSE: {
    id: 'CORPSE',
    image: 'corpse_card',
    name: 'Corpse',

    idleZoneEffect: {
      homunculus: {
        timeTillTrigger: 0,
        tooltip: 'I need to get rid of the evidence',
        effect: new ActivationContainer([
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
        ]),
      },
    },
  },
} as const satisfies Record<CardId, CardDefinition>
