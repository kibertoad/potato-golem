import type { CardId } from '../../registries/cardRegistry'
import {
  AttackHomunculusCardActivation,
  ChatCardActivation, DecomposeCardActivation, MoveToZoneCardActivation,
  SearchAndDecideCardActivation, SearchAndDestroyCardActivation,
  TheLawMoveActivation,
} from '../../activations/card/cardActivations'
import { worldModel } from '../../state/WorldModel'
import { CardDefinitionNew } from '../cardDefinitionTypes'

export const creatureCardDefinitions = {
  THE_ID: {
    id: 'THE_ID',
    image: 'the_id_card',
    name: 'The Id',
    nonDraggable: true,
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

  MERCHANT: {
    id: 'MERCHANT',
    name: 'Merchant',
    image: 'merchant_card',
    nonDraggable: true,
    prettyEffects: {
      chatBubbleOrigin: { x: 80, y: 80 },
    }
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
    prettyEffects: {
      chatBubbleOrigin: { x: 80, y: 85 },
      chatBubbleRightOffset: 42,
      spawnPhrases: [
        'Police! Open up!',
        'We had a report on this place.',
        'What is going on here?',
        'Stop right there!',
      ],
    },
    idleZoneEffect: {
      any: {
        timeTillTrigger: 1,
        effect: [new TheLawMoveActivation()],
      },
    },
  },

  THE_ROUGH_KIND: {
    id: 'THE_ROUGH_KIND',
    image: 'rough_kind_card',
    name: 'The Rough Kind',
    nonDraggable: true,
    prettyEffects: {
      chatBubbleOrigin: { x: 68, y: 125 },
      chatBubbleRightOffset: 30,
      spawnPhrases: ['Well hello there!', 'Now this place looks antiquish!'],
    },
    idleZoneEffect: {
      streets: {
        timeTillTrigger: 1,
        effect: [
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
        ],
      },
      home: {
        timeTillTrigger: 1,
        effect: [
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
        ],
      },
      alchemy: {
        timeTillTrigger: 1,
        effect: [
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
        ],
      },
    },
  },
} as const satisfies Partial<Record<CardId, CardDefinitionNew>>
