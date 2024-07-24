import { DescribedTargettedMultipleActivation } from '@potato-golem/core'
import {
  DecomposeCardActivation,
  FeedActivation,
  GainConscienceActivation,
  GainHatredActivation,
  GainHealthActivation,
} from '../activations/card/cardActivations'
import type { Dependencies } from '../diConfig'
import type { CardModel } from '../entities/CardModel'
import type { ImageId } from '../registries/imageRegistry'
import type { Zone } from '../registries/zoneRegistry'
import type { WorldModel } from '../state/WorldModel'

export type IdleZoneEffect = {
  timeTillTrigger: number
  effect: DescribedTargettedMultipleActivation<CardModel>
}

export type CardDefinition = {
  id: string
  name: string
  image?: ImageId

  // Effect that is triggered after card staying within a zone for a while
  idleZoneEffect?: Partial<Record<Zone, IdleZoneEffect>>
}

export type CardDefinitions = ReturnType<
  (typeof CardDefinitionGenerator.prototype)['generateDefinitions']
>

export type CardId = keyof CardDefinitions

export class CardDefinitionGenerator {
  private readonly worldModel: WorldModel

  constructor({ worldModel }: Dependencies) {
    this.worldModel = worldModel
  }

  generateDefinitions() {
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

      MOLDY_SAUSAGE: {
        id: 'MOLDY_SAUSAGE',
        name: 'Moldy Sausage',
        image: 'corpse_card',
        idleZoneEffect: {
          any: {
            timeTillTrigger: 3,
            effect: new DescribedTargettedMultipleActivation([new DecomposeCardActivation()]),
          },
        },
      },

      GOLD: {
        id: 'GOLD',
        name: 'Gold',
        image: 'gold_card',
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
