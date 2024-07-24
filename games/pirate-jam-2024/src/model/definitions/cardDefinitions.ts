import { DescribedTargettedMultipleActivation, type EventSink } from '@potato-golem/core'
import type { BoardSupportedEvents } from '../../scenes/board/BoardScene'
import {
  DamageActivation,
  DecomposeCardActivation,
  FeedActivation,
  GainConscienceActivation,
  GainHatredActivation,
  GainHealthActivation,
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

      ALEMBIC: {
        id: 'ALEMBIC',
        name: 'Alembic',
      },

      BUNSEN_BURNER: {
        id: 'BUNSEN_BURNER',
        name: 'Bunsen burner',
      },

      HEALTH: {
        id: 'HEALTH',
        name: 'Health',
        image: 'health_card',
        idleZoneEffect: {
          homunculus: {
            timeTillTrigger: 1,
            effect: new DescribedTargettedMultipleActivation([
              new GainHealthActivation(this.worldModel.homunculusModel, 1),
              new FeedActivation(this.worldModel.homunculusModel, 1),
              new DecomposeCardActivation(),
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
        idleZoneEffect: {
          homunculus: {
            timeTillTrigger: 1,
            effect: new DescribedTargettedMultipleActivation([
              new DamageActivation(this.worldModel.homunculusModel, 1),
              new DecomposeCardActivation(),
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
            effect: new DescribedTargettedMultipleActivation([new DecomposeCardActivation()]),
          },
        },
      },

      MERCHANT: {
        id: 'MERCHANT',
        name: 'Merchant',
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
    } as const satisfies Record<string, CardDefinition>
  }
}
