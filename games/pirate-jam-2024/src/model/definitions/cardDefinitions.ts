import {
  DescribedTargettedAsyncMultiplexActivation,
  type EventSink,
  TargettedMultiplexActivation,
} from '@potato-golem/core'
import type { Precondition } from '@potato-golem/core'
import type { TargettedPrecondition, TargettedReasonedPrecondition } from '@potato-golem/core'
import type { Position } from '@potato-golem/ui'
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
  GainHatredActivation,
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
import { SpawnCardActivation } from '../activations/event/extraEventActivations'
import type { CardModel } from '../entities/CardModel'
import { CheckIfActiveCardPrecondition } from '../preconditions/CheckIfActiveCardPrecondition'
import { CombinedZonePrecondition } from '../preconditions/CombinedZonePrecondition'
import { RoughKindPrecondition } from '../preconditions/RoughKindPrecondition'
import type { CardId } from '../registries/cardRegistry'
import { EventEmitters } from '../registries/eventEmitterRegistry'
import type { ImageId } from '../registries/imageRegistry'
import type { SfxId } from '../registries/sfxRegistry'
import type { Zone } from '../registries/zoneRegistry'
import { worldModel } from '../state/WorldModel'
import { QueuedTargettedActivation } from '@potato-golem/core'
import type { ActivationContextSingleCard } from '../activations/common/ActivationContext'

export type CardEffectDefinition = {
  timeTillTrigger: number
  tooltip?: string
  preconditions?: Array<
    Precondition | TargettedPrecondition<CardModel> | TargettedReasonedPrecondition<CardModel>
  >
  effect: DescribedTargettedAsyncMultiplexActivation<ActivationContextSingleCard>
}

export type CardDefinition = {
  id: CardId
  name: string
  image?: ImageId
  activeImage?: ImageId
  activateSfx?: SfxId
  deactivateSfx?: SfxId
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
  SINGING_MUSHROOMS: {
    id: 'SINGING_MUSHROOMS',
    name: 'Singing Mushrooms',
    image: 'singing_mushrooms_card',

    idleZoneEffect: {
      homunculus: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedAsyncMultiplexActivation([
          new EatCardActivation(),
          new FeedActivation(worldModel.homunculusModel, 1, true),
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
        effect: new DescribedTargettedAsyncMultiplexActivation([
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
        effect: new DescribedTargettedAsyncMultiplexActivation([
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
        effect: new DescribedTargettedAsyncMultiplexActivation([
          new EatCardActivation(),
          new DamageActivation(worldModel.homunculusModel, 1),
          new SpawnCardActivation(
            eventSink,
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
        effect: new DescribedTargettedAsyncMultiplexActivation([
          new SpawnCardActivation(
            eventSink,
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
        effect: new DescribedTargettedAsyncMultiplexActivation([
          new SpawnCardActivation(
            eventSink,
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
        effect: new DescribedTargettedAsyncMultiplexActivation([
          new DecomposeCardActivation(),
          new StartEventActivation('SHOPKEEPER', eventSink),
          new QueueActivation(
            eventSink,
            new QueuedTargettedActivation({
              id: 'SPAWN_ROUGH_KIND',
              unique: true,
              description: 'May attract attention',
              activatesIn: 1,
              activation: new SpawnCardActivation(
                eventSink,
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
              ),
            }),
          ),
        ]),
      },

      THE_LAW: {
        timeTillTrigger: 0,
        tooltip: `It's not a bribe if it's a donation...`,
        effect: new DescribedTargettedAsyncMultiplexActivation([
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ]),
      },

      THE_ROUGH_KIND: {
        timeTillTrigger: 0,
        tooltip: `Take it and leave me alone already!`,
        effect: new DescribedTargettedAsyncMultiplexActivation([
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
        effect: new DescribedTargettedAsyncMultiplexActivation([
          new DecomposeCardActivation(),
          new StartEventActivation('SHOPKEEPER', eventSink),
        ]),
      },

      THE_LAW: {
        timeTillTrigger: 0,
        tooltip: `It's not a bribe if it's a donation...`,
        effect: new DescribedTargettedAsyncMultiplexActivation([
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ]),
      },

      THE_ROUGH_KIND: {
        timeTillTrigger: 0,
        tooltip: `Take it and leave me alone already!`,
        effect: new DescribedTargettedAsyncMultiplexActivation([
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
        timeTillTrigger: 0,
        tooltip: `This won't hurt a bit`,
        effect: new DescribedTargettedAsyncMultiplexActivation([
          new CancelDragCardActivation('HEALTH'),
          new AnimateCardActivation('poof', 0),
          new SpawnCardActivation(eventSink, {
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
        effect: new DescribedTargettedAsyncMultiplexActivation([new TheLawMoveActivation()]),
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
        effect: new DescribedTargettedAsyncMultiplexActivation([
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
        effect: new DescribedTargettedAsyncMultiplexActivation([
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
        effect: new DescribedTargettedAsyncMultiplexActivation([
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
        effect: new DescribedTargettedAsyncMultiplexActivation<CardModel>([
          new EatCardActivation(),
          new GainHatredActivation(worldModel.homunculusModel, 1),
          new FeedActivation(worldModel.homunculusModel, 1),
          new SpawnCardActivation(
            eventSink,
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
