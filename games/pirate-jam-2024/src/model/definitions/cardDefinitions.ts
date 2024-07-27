import {
  DescribedTargettedMultipleActivation,
  type EventSink,
  QueuedActivation,
} from '@potato-golem/core'
import type { BoardSupportedEvents } from '../../scenes/board/BoardScene'
import {
  DamageActivation,
  DecomposeBothCardsActivation,
  DecomposeCardActivation,
  EatCardActivation,
  FeedActivation,
  GainConscienceActivation,
  GainHatredActivation,
  GainHealthActivation,
  QueueActivation,
  StartEventActivation,
} from '../activations/card/cardActivations'
import { SpawnCardActivation } from '../activations/event/extraEventActivations'
import type { CardModel } from '../entities/CardModel'
import type { CardId } from '../registries/cardRegistry'
import { EventEmitters } from '../registries/eventEmitterRegistry'
import type { ImageId } from '../registries/imageRegistry'
import type { Zone } from '../registries/zoneRegistry'
import { worldModel } from '../state/WorldModel'

export type CardEffectDefinition = {
  timeTillTrigger: number
  effect: DescribedTargettedMultipleActivation<CardModel>
}

export type CardDefinition = {
  id: string
  name: string
  image?: ImageId
  nonDraggable?: boolean

  // Effect that is triggered after card staying within a zone for a while
  idleZoneEffect?: Partial<Record<Zone, CardEffectDefinition>>

  cardCombinationEffect?: Partial<Record<CardId, CardEffectDefinition>>
}

export type CardDefinitions = typeof cardDefinitions

const eventSink: EventSink<BoardSupportedEvents> = EventEmitters.boardEventEmitter

export const cardDefinitions = {
  HUMILITY: {
    id: 'HUMILITY',
    name: 'Humility',
    idleZoneEffect: {
      homunculus: {
        timeTillTrigger: 1,
        effect: new DescribedTargettedMultipleActivation<CardModel>([
          new GainConscienceActivation(worldModel.homunculusModel, 1),
          new FeedActivation(worldModel.homunculusModel, 1),
          new DecomposeCardActivation(),
        ]),
      },
    },
  },

  ANGER: {
    id: 'ANGER',
    name: 'Anger',
    idleZoneEffect: {
      homunculus: {
        timeTillTrigger: 1,
        effect: new DescribedTargettedMultipleActivation([
          new GainHatredActivation(worldModel.homunculusModel, 1),
          new FeedActivation(worldModel.homunculusModel, 1),
          new DecomposeCardActivation(),
        ]),
      },
    },
  },

  ABSYNTHE: {
    id: 'ABSYNTHE',
    name: 'Absynthe',
    image: 'booze_card',
    idleZoneEffect: {
      homunculus: {
        timeTillTrigger: 1,
        effect: new DescribedTargettedMultipleActivation<CardModel>([
          new GainHatredActivation(worldModel.homunculusModel, 1),
          new FeedActivation(worldModel.homunculusModel, 1),
          new DecomposeCardActivation(),
        ]),
      },
    },
  },

  MOLD: {
    id: 'MOLD',
    name: 'Mold',
    cardCombinationEffect: {
      ALCHEMICAL_SUPPLIES: {
        timeTillTrigger: 2,
        effect: new DescribedTargettedMultipleActivation<CardModel>([
          new SpawnCardActivation(eventSink, {
            cardId: 'EXPLOSIVES', // replace with explosives
            description: 'Create 1 Explosives',
            zone: 'lab',
          }),

          new DecomposeBothCardsActivation(),
        ]),
      },
    },
  },

  ALCHEMICAL_SUPPLIES: {
    id: 'ALCHEMICAL_SUPPLIES',
    image: 'alchemical_supplies_card',
    name: 'Alchemical supplies',
  },

  EXPLOSIVES: {
    id: 'EXPLOSIVES',
    name: 'Explosives',
    cardCombinationEffect: {
      THE_ROUGH_KIND: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([
          new DecomposeBothCardsActivation(),
          new SpawnCardActivation(eventSink, {
            zone: 'home',
            cardId: 'GOLD',
            amount: 2,
            description: 'Get 2 Gold',
            spawnAnimation: 'pop_in',
          }),
        ]),
      },

      THE_LAW: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([
          new DecomposeBothCardsActivation(),
        ]),
      },

      THE_RAID: {
        timeTillTrigger: 0,
        effect: new DescribedTargettedMultipleActivation([
          new DecomposeBothCardsActivation(),
        ]),
      }
    }
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
          new FeedActivation(worldModel.homunculusModel, 1),
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
          new FeedActivation(worldModel.homunculusModel, 1),
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
                cardId: 'THE_ROUGH_KIND',
                description: '',
                spawnAnimation: 'pop_in',
              }),
            }),
          ),
        ]),
      },
    },
  },

  MEDICINE: {
    id: 'MEDICINE',
    name: 'Medicne',
    image: 'medicine_card',
    idleZoneEffect: {
      home: {
        timeTillTrigger: 1,
        effect: new DescribedTargettedMultipleActivation([
          new SpawnCardActivation(eventSink, {
            spawnAnimation: 'pop_in',
            description: 'Spawn 1 Health',
            cardId: 'HEALTH',
            zone: 'home',
          }),
          new DecomposeCardActivation(),
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
    nonDraggable: true,
  },

  THE_LAW: {
    id: 'THE_LAW',
    name: 'The Law',
    image: 'the_law_card',
    nonDraggable: true,
  },

  THE_ROUGH_KIND: {
    id: 'THE_ROUGH_KIND',
    image: 'rough_kind_card',
    name: 'The Rough Kind',
    nonDraggable: true,
  },
} as const satisfies Record<string, CardDefinition>
