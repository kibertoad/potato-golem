import type { CardId } from '../../registries/cardRegistry'
import type { CardDefinitionNew } from '../cardDefinitionsNew'
import { SfxRegistry } from '../../registries/sfxRegistry'
import { CheckIfActiveCardPrecondition } from '../../preconditions/CheckIfActiveCardPrecondition'
import {
  DescribedTargettedAsyncMultiplexActivation, type EventSink,
  QueuedTargettedActivation,
  TargettedMultiplexActivation,
} from '@potato-golem/core'
import type { CardModel } from '../../entities/CardModel'
import {
  DecomposeOtherCardActivation,
  QueueActivation,
  SetActiveCardActivation, StartEventActivation,
} from '../../activations/card/cardActivations'
import { SpawnCardActivation } from '../../activations/event/extraEventActivations'
import type { BoardSupportedEvents } from '../../../scenes/board/BoardScene'
import { EventEmitters } from '../../registries/eventEmitterRegistry'

const eventSink: EventSink<BoardSupportedEvents> = EventEmitters.boardEventEmitter

export const propertyCards = {
  WORKBENCH: {
    id: 'WORKBENCH',
    name: 'Workbench',
    image: 'workbench_card',
    zoneCombinationEffect: {
      activateSfx: SfxRegistry.LIGHT_UP,
      deactivateSfx: SfxRegistry.PUT_OUT,
    },
    activeImage: 'workbench_card_on',
    nonDraggable: true,
    cardCombinationEffect: {
      MOLD: {
        preconditions: [new CheckIfActiveCardPrecondition(false, `It's already cooking`)],
        tooltip: `I bet I can make something more potent with this`,
        effect: [
          new QueueActivation(
            eventSink,
            new QueuedTargettedActivation({
              id: 'WORKBENCH_COOK_POISON',
              unique: true,
              description: 'Need to let it simmer',
              activatesIn: 1,
              activation: new TargettedMultiplexActivation([
                new SetActiveCardActivation(false),
                // new PlaySfxActivation([SfxRegistry.POOF]),
                new SpawnCardActivation(eventSink, {
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
        effect: [
          new DecomposeOtherCardActivation('poof', 200),
          new StartEventActivation('CRAFT_MUSHROOMS', eventSink),
        ],
      },
      ALCHEMICAL_SUPPLIES: {
        preconditions: [new CheckIfActiveCardPrecondition(false, `It's already cooking`)],
        tooltip: `Options are limitless`,
        effect: [
          new DecomposeOtherCardActivation('poof', 200),
          new StartEventActivation('CRAFT_SUPPLIES', eventSink),
        ],
      },
      WATCHING_FLOWER: {
        preconditions: [new CheckIfActiveCardPrecondition(false, `It's already cooking`)],
        effect: [
          new DecomposeOtherCardActivation('poof', 200),
          new StartEventActivation('CRAFT_FLOWERS', eventSink),
        ],
      },
      ENLIGHTENED_MANDRAKE: {
        preconditions: [new CheckIfActiveCardPrecondition(false, "It's already cooking")],
        effect: [
          new DecomposeOtherCardActivation('poof', 200),
          new StartEventActivation('CRAFT_MANDRAKE', eventSink),
        ],
      },
    },
  },


} as const satisfies Partial<Record<CardId, CardDefinitionNew>>
