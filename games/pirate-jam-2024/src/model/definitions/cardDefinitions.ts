import {
  DescribedTargettedMultipleActivation,
  type EventSink,
  QueuedActivation,
} from '@potato-golem/core'
import type { BoardSupportedEvents } from '../../scenes/board/BoardScene'
import {
  DamageActivation,
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
import type { Dependencies } from '../diConfig'
import type { CardModel } from '../entities/CardModel'
import type { CardId } from '../registries/cardRegistry'
import type { ImageId } from '../registries/imageRegistry'
import type { Zone } from '../registries/zoneRegistry'
import type { WorldModel } from '../state/WorldModel'

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

export type CardDefinitions = ReturnType<
  (typeof CardDefinitionGenerator.prototype)['generateDefinitions']
>

export class CardDefinitionGenerator {
  private readonly worldModel: WorldModel

  constructor({ worldModel }: Dependencies) {
    this.worldModel = worldModel
  }

  generateDefinitions(eventSink: EventSink<BoardSupportedEvents>) {
    return {
      HUMILITY: {
        id: 'HUMILITY',
        name: 'Humility',
        idleZoneEffect: {
          homunculus: {
            timeTillTrigger: 1,
            effect: new DescribedTargettedMultipleActivation<CardModel>([
              new GainConscienceActivation(this.worldModel.homunculusModel, 1),
              new FeedActivation(this.worldModel.homunculusModel, 1),
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
              new GainHatredActivation(this.worldModel.homunculusModel, 1),
              new FeedActivation(this.worldModel.homunculusModel, 1),
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
              new GainHatredActivation(this.worldModel.homunculusModel, 1),
              new FeedActivation(this.worldModel.homunculusModel, 1),
              new DecomposeCardActivation(),
            ]),
          },
        },
      },

      MOLD: {
        id: 'MOLD',
        name: 'Mold',
        cardCombinationEffect: {
          BUNSEN_BURNER: {
            timeTillTrigger: 2,
            effect: new DescribedTargettedMultipleActivation<CardModel>([
              new SpawnCardActivation(eventSink, {
                cardId: 'POISON',
                zone: 'alchemy',
              }),

              new DecomposeCardActivation(),
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
            timeTillTrigger: 1,
            effect: new DescribedTargettedMultipleActivation([
              new EatCardActivation(),
              new GainHealthActivation(this.worldModel.homunculusModel, 1),
              new FeedActivation(this.worldModel.homunculusModel, 1),
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
        },
      },

      POISON: {
        id: 'POISON',
        name: 'Poison',
        image: 'poison_card',
        idleZoneEffect: {
          homunculus: {
            timeTillTrigger: 1,
            effect: new DescribedTargettedMultipleActivation([
              new EatCardActivation(),
              new DamageActivation(this.worldModel.homunculusModel, 1),
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
              new GainHealthActivation(this.worldModel.alchemistModel, 1),
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
        name: 'The Rough Kind',
        nonDraggable: true,
      },
    } as const satisfies Record<string, CardDefinition>
  }
}
