import type { CardId } from '../../registries/cardRegistry'
import type { CardDefinitionNew } from '../cardDefinitionsNew'
import { SfxRegistry } from '../../registries/sfxRegistry'
import { CheckIfActiveCardPrecondition } from '../../preconditions/CheckIfActiveCardPrecondition'
import {
  type EventSink,
  QueuedTargettedActivation, TargettedAsyncMultiplexActivation,
} from '@potato-golem/core'
import {
  DecomposeOtherCardActivation,
  QueueActivation,
  SetActiveCardActivation, StartEventActivation,
} from '../../activations/card/cardActivations'
import { SpawnCardActivation } from '../../activations/event/extraEventActivations'
import type { BoardSupportedEvents } from '../../../scenes/board/BoardScene'
import { EventEmitters } from '../../registries/eventEmitterRegistry'
import { createMultiOptionCraftingActivation } from '../definitionGenerators/craftingDefinitions'

const eventSink: EventSink<BoardSupportedEvents> = EventEmitters.boardEventEmitter

export const propertyCardDefinitions = {
  WORKBENCH: {
    id: 'WORKBENCH',
    name: 'Workbench',
    image: 'workbench_card',
    prettyEffects: {
      activateSfx: SfxRegistry.LIGHT_UP,
      deactivateSfx: SfxRegistry.PUT_OUT,
    },
    activeImage: 'workbench_card_on',
    nonDraggable: true,
    cardCombinationEffect: {
      MOLD: {
        preconditions: [new CheckIfActiveCardPrecondition(false, `It's already cooking`)],
        tooltip: `I bet I can make something more potent with this`,
        effects: [
          new QueueActivation(
            new QueuedTargettedActivation({
              id: 'WORKBENCH_COOK_POISON',
              unique: true,
              description: 'Need to let it simmer',
              activatesIn: 1,
              activation: new TargettedAsyncMultiplexActivation([
                // ToDo restore this effect
                new SetActiveCardActivation(false),

                // new PlaySfxActivation([SfxRegistry.POOF]),
                new SpawnCardActivation({
                  cardId: 'POISON', // replace with explosives
                  description: 'Create 1 Poison',
                  zone: 'lab',
                }),
              ]),
            }),
          ),
          new DecomposeOtherCardActivation('poof', 300),
          new SetActiveCardActivation(true),
        ],
      },
      SINGING_MUSHROOMS: {
        preconditions: [new CheckIfActiveCardPrecondition(false, `It's already cooking`)],
        tooltip: `I think I can make something out of this`,
        effects: [
          new DecomposeOtherCardActivation('poof', 200),
          new StartEventActivation('CRAFT_MUSHROOMS'),
        ],
      },
      ALCHEMICAL_SUPPLIES: {
        preconditions: [new CheckIfActiveCardPrecondition(false, `It's already cooking`)],
        tooltip: `Options are limitless`,
        effects: createMultiOptionCraftingActivation({
          eventName: 'CRAFT_SUPPLIES'
        })
      },
      WATCHING_FLOWER: {
        preconditions: [new CheckIfActiveCardPrecondition(false, `It's already cooking`)],
        effects: createMultiOptionCraftingActivation({
          eventName: 'CRAFT_FLOWERS'
        })
      },
      ENLIGHTENED_MANDRAKE: {
        preconditions: [new CheckIfActiveCardPrecondition(false, "It's already cooking")],
        effects: createMultiOptionCraftingActivation({
          eventName: 'CRAFT_MANDRAKE'
        })
      },
    },
  },

  PORTAL: {
    id: 'PORTAL',
    name: 'Portal',
    image: 'portal_card',
    nonDraggable: true,
  },
} as const satisfies Partial<Record<CardId, CardDefinitionNew>>
