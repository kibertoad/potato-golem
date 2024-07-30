import {
  DescribedTargettedMultipleActivation,
  type EventSink,
  QueuedActivation,
} from '@potato-golem/core'
import type { Precondition } from '@potato-golem/core'
import type { TargettedPrecondition } from '@potato-golem/core'
import type { Position } from '@potato-golem/ui'
import type { TargettedReasonedPrecondition } from '../../../../../packages/core/src/core/preconditions/Precondition'
import type { BoardSupportedEvents } from '../../scenes/board/BoardScene'
import {
  AnimateCardActivation,
  AttackHomunculusCardActivation,
  ChatCardActivation,
  DamageActivation,
  DecomposeBothCardsActivation,
  DecomposeCardActivation,
  DelayActivation,
  DestroyCardActivation,
  EatCardActivation,
  FeedActivation,
  GainHatredActivation,
  GainHealthActivation,
  LawIsDeadActivation,
  MoveToZoneCardActivation,
  NextTurnActivation,
  PlaySfxActivation,
  QueueActivation,
  SearchAndDecideCardActivation,
  SearchAndDestroyCardActivation,
  StartEventActivation,
} from '../activations/card/cardActivations'
import { SpawnCardActivation } from '../activations/event/extraEventActivations'
import type { CardModel } from '../entities/CardModel'
import { CombinedZonePrecondition } from '../preconditions/CombinedZonePrecondition'
import { RoughKindPrecondition } from '../preconditions/RoughKindPrecondition'
import type { CardId } from '../registries/cardRegistry'
import { EventEmitters } from '../registries/eventEmitterRegistry'
import type { ImageId } from '../registries/imageRegistry'
import { SfxRegistry } from '../registries/sfxRegistry'
import type { Zone } from '../registries/zoneRegistry'
import { worldModel } from '../state/WorldModel'

export type CardEffectDefinition = {
  timeTillTrigger: number
  preconditions?: Array<
    Precondition | TargettedPrecondition<CardModel> | TargettedReasonedPrecondition<CardModel>
  >
  effect: DescribedTargettedMultipleActivation<CardModel>
}

export type CardDefinition = {
  id: CardId
  name: string
  image?: ImageId
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
        timeTillTrigger: 1,
        effect: new DescribedTargettedMultipleActivation<CardModel>([
          new GainHatredActivation(worldModel.homunculusModel, 1),
          new FeedActivation(worldModel.homunculusModel, 1),
          new DecomposeCardActivation(),
          new NextTurnActivation(),
        ]),
      },
    },
    cardCombinationEffect: {
      THE_ROUGH_KIND: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([new DecomposeBothCardsActivation()]),
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
        effect: new DescribedTargettedMultipleActivation<CardModel>([
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
        ]),
      },

      WORKBENCH: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation<CardModel>([
          new SpawnCardActivation(
            eventSink,
            {
              cardId: 'POISON', // replace with explosives
              description: 'Create 1 Poison',
              zone: 'lab',
            },
            0,
          ),
          new DecomposeCardActivation(),
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
    nonDraggable: true,
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
    cardCombinationEffect: {
      WORKBENCH: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([
          new DecomposeCardActivation(),
          new StartEventActivation('CRAFT_MUSHROOMS', eventSink),
          new NextTurnActivation(),
        ]),
      },
    },
  },

  WATCHING_FLOWER: {
    id: 'WATCHING_FLOWER',
    name: 'Watching Flower',
    image: 'watching_flower_card',
    cardCombinationEffect: {
      WORKBENCH: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([
          new DecomposeCardActivation(),
          new StartEventActivation('CRAFT_FLOWERS', eventSink),
        ]),
      },
    },
  },

  ENLIGHTENED_MANDRAKE: {
    id: 'ENLIGHTENED_MANDRAKE',
    name: 'Enlightened Mandrake',
    image: 'enlightened_mandrake_card',

    cardCombinationEffect: {
      WORKBENCH: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([
          new DecomposeCardActivation(),
          new StartEventActivation('CRAFT_MANDRAKE', eventSink),
        ]),
      },
    },
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
        effect: new DescribedTargettedMultipleActivation([
          new SpawnCardActivation(
            eventSink,
            {
              zone: 'home',
              cardId: 'GOLD',
              amount: 2,
              description: 'Get 2 Gold',
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
        effect: new DescribedTargettedMultipleActivation([
          new DecomposeBothCardsActivation(),
          new LawIsDeadActivation(),
          new NextTurnActivation(),
        ]),
      },

      THE_RAID: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([
          new DecomposeBothCardsActivation(),
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
        effect: new DescribedTargettedMultipleActivation([
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
    idleZoneEffect: {
      any: {
        timeTillTrigger: 3,
        effect: new DescribedTargettedMultipleActivation([new DecomposeCardActivation()]),
      },
      homunculus: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([
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
        effect: new DescribedTargettedMultipleActivation([
          new EatCardActivation(),
          new DamageActivation(worldModel.homunculusModel, 1),
          new NextTurnActivation(),
        ]),
      },
    },
    cardCombinationEffect: {
      THE_LAW: {
        timeTillTrigger: 0,
        preconditions: [
          new CombinedZonePrecondition(
            ['home', 'homunculus', 'lab'],
            "Don't think it's wise to try this on the streets",
          ),
        ],
        effect: new DescribedTargettedMultipleActivation([
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
    },
  },

  GOLD: {
    id: 'GOLD',
    name: 'Gold',
    image: 'gold_card',
    cardCombinationEffect: {
      MERCHANT: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([
          new DecomposeCardActivation(),
          new StartEventActivation('SHOPKEEPER', eventSink),
          new QueueActivation(
            eventSink,
            new QueuedActivation({
              id: 'SPAWN_ROUGH_KIND',
              unique: true,
              description: 'May attract attention',
              activatesIn: 1,
              activation: new SpawnCardActivation(eventSink, {
                zone: 'streets',
                precondition: new RoughKindPrecondition(),
                cardId: 'THE_ROUGH_KIND',
                description: '',
                spawnAnimation: 'pop_in',
              }),
            }),
          ),
        ]),
      },

      THE_LAW: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ]),
      },

      THE_ROUGH_KIND: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([
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
        effect: new DescribedTargettedMultipleActivation([
          new DecomposeCardActivation(),
          new StartEventActivation('SHOPKEEPER', eventSink),
        ]),
      },

      THE_LAW: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([
          new DecomposeBothCardsActivation(),
          new NextTurnActivation(),
        ]),
      },

      THE_ROUGH_KIND: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([
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
        effect: new DescribedTargettedMultipleActivation([
          //TODO: Fix ability to drag a heart to medicine causing the heart to dissapear
          new DecomposeBothCardsActivation('poof', 300),
          new SpawnCardActivation(eventSink, {
            zone: 'home',
            cardId: 'HEALTH',
            amount: 2,
            description: 'Get 1 Health',
          }),
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
      streets: {
        timeTillTrigger: 1,
        effect: new DescribedTargettedMultipleActivation([
          new ChatCardActivation([
            'Hmmm...Interesting...',
            'What do we have here?',
            "Don't mind if I take a look?",
          ]),
          new MoveToZoneCardActivation(worldModel, ['home', 'homunculus']),
        ]),
      },
      homunculus: {
        timeTillTrigger: 1,
        effect: new DescribedTargettedMultipleActivation([
          new ChatCardActivation([
            'I will stop this ABOMINATION!',
            'Take this!',
            'In the name of the LAW!',
          ]),
          new AttackHomunculusCardActivation(worldModel.homunculusModel, 1),
          new PlaySfxActivation([SfxRegistry.POOF]), //This is for the CORPSE appearence
          new AnimateCardActivation('blood_splat', 0),
          new FeedActivation(worldModel.homunculusModel, 1, true),
          new SpawnCardActivation(eventSink, {
            spawnAnimation: 'pop_in',
            description: 'Spawn 1 Corpse',
            cardId: 'CORPSE',
            zone: 'homunculus',
          }),
          new DelayActivation(1100), //Allow blood splat animation to finish
          new DestroyCardActivation(),
        ]),
      },
      home: {
        timeTillTrigger: 1,
        effect: new DescribedTargettedMultipleActivation([
          new SearchAndDecideCardActivation(
            'CORPSE',
            'home',
            [
              new ChatCardActivation(['Is this...A CORPSE?!', 'A body?! I KNEW IT!']),
              new ChatCardActivation([
                'You will pay for this heresy!',
                'I will stop you!',
                'In the name of the LAW!',
              ]),
              new SearchAndDestroyCardActivation('HEALTH', 'home'),
              new PlaySfxActivation([SfxRegistry.POOF]), //This is for the CORPSE appearence
              new AnimateCardActivation('blood_splat', 0),
              new SpawnCardActivation(eventSink, {
                spawnAnimation: 'pop_in',
                description: 'Spawn 1 Corpse',
                cardId: 'CORPSE',
                zone: 'home',
              }),
              new DelayActivation(1100), //Allow blood splat animation to finish
              new DestroyCardActivation(),
            ],
            [new ChatCardActivation(['Guess nothing to see here']), new DecomposeCardActivation()],
          ),
        ]),
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
        effect: new DescribedTargettedMultipleActivation([
          new ChatCardActivation([
            'Okay boys, turn this place upside down!',
            "Let's check this place out!",
          ]),
          new MoveToZoneCardActivation(worldModel, ['home']),
        ]),
      },
      home: {
        timeTillTrigger: 1,
        effect: new DescribedTargettedMultipleActivation([
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
              new MoveToZoneCardActivation(worldModel, ['homunculus']),
            ],
          ),
        ]),
      },
      homunculus: {
        timeTillTrigger: 1,
        effect: new DescribedTargettedMultipleActivation([
          new ChatCardActivation(['What the hell is this?!', 'Get him boys!', 'Get it off me!']),
          new AttackHomunculusCardActivation(worldModel.homunculusModel, 1, false),
        ]),
      },
    },
  },

  CORPSE: {
    id: 'CORPSE',
    image: 'corpse_card',
    name: 'Corpse',
  },
} as const satisfies Record<CardId, CardDefinition>
