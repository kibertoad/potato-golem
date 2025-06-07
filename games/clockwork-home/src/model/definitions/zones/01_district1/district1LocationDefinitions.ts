import {
  buildValueSufficientPreconditions,
  type RegistryEntityId,
  ValueSufficientPrecondition,
} from '@potato-golem/core'
import type { LocationDefinition } from '../common/LocationDefinition'
import {NeverPrecondition} from "../../../preconditions/NeverPrecondition";
import { worldModel } from '../../../entities/WorldModel'
import { StoryConclusionActivation } from '../../../activations/StoryConclusionActivation'

export const locationRegistry = {
  EXPLORE_DISTRICT_1: 'exploreDistrict1',
  BACK_ALLEY_SAWBONES: 'backAlleySawbones',
  YACHT: 'yacht'
} as const

export const district1LocationDefinitions = {
  exploreDistrict1: {
    id: locationRegistry.EXPLORE_DISTRICT_1,
    name: 'Explore District 1',
    image: 'card_background_decor',
    stories: [
    ],
  },

  backAlleySawbones: {
    id: locationRegistry.BACK_ALLEY_SAWBONES,
    name: 'Back Alley Sawbones',
    image: 'card_background_decor',
    stories: [
      {
        id: 'patchup_job',
        name: 'Get a quick patchup job',
        conditionsToEnable: buildValueSufficientPreconditions([
          {
            trackedValue: worldModel.playerStates.wounds,
            targetValue: 3,
          },
          {
            trackedValue: worldModel.playerStates.euros,
            targetValue: 20,
          }
        ]),
        effects: [new StoryConclusionActivation({
            text: 'The pain. The blood. Hope it was all worth it.',
            image: "rocket",
            stateChanges: {
              wounds: -1,
              cred: -20
            }
          })],
        image: 'rocket',
      },

      {
        id: 'buy_cheap_meds',
        name: 'Buy some cheap meds',
        conditionsToEnable: [new ValueSufficientPrecondition(
          worldModel.playerStates.euros, 10,
        )],
        effects: [new StoryConclusionActivation({
            text: 'Will it make you feel better? No. But will it eventually help? Who knows.',
            image: "rocket",
            stateChanges: {
              cheap_meds: 1,
              euros: -10
            }})
          ],
        image: 'rocket',
      }
    ],
  },

  yacht: {
    id: locationRegistry.YACHT,
    name: 'Back Alley Sawbones',
    image: 'card_background_decor',
    stories: [
    ],
    conditionsToShow: [new NeverPrecondition()]
  },
} as const satisfies Record<RegistryEntityId<typeof locationRegistry>, LocationDefinition>
