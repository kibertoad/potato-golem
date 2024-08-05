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
