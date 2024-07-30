import {
  type Activation,
  type EventSink,
  MultiplexActivation,
  type Precondition,
  QueuedActivation,
} from '@potato-golem/core'
import type { BoardSupportedEvents } from '../../scenes/board/BoardScene'
import {
  NextTurnActivation,
  QueueActivation,
  SetActiveCardActivation,
} from '../activations/card/cardActivations'
import { ConcludeEventActivation, type EventEventId } from '../activations/event/eventActivations'
import { SpawnCardActivation } from '../activations/event/extraEventActivations'
import { EventEmitters } from '../registries/eventEmitterRegistry'
import type { ImageId } from '../registries/imageRegistry'

export type EventOption = {
  text: string
  effect: Activation
  conditions?: Precondition
}

export type EventDefinition = {
  id: string
  playableByDirector?: boolean // default is false
  name: string
  description: string
  image: ImageId
  effect?: Activation
  options?: EventOption[]
}

export type EventDefinitions = typeof eventDefinitions

export type EventId = keyof EventDefinitions

const eventSink: EventSink<EventEventId> = EventEmitters.eventViewEmitter
const boardEventSink: EventSink<BoardSupportedEvents> = EventEmitters.boardEventEmitter

export const eventDefinitions = {
  INTRO: {
    id: 'INTRO',
    name: 'And so it begins',
    description: `
In the past 14 days, ever since you got that letter, you were working every night. You were given a chance to create something out of essentially nothing.
Lack of sleep is compensated with caffeine.
Lack of focus is fought with alcohol.
The last thing to do is to give it a part of yourself.
And in this case it means to add your blood.
You draw your blade, and make a cut on your hard.
It needs quite a lot of blood. You keep holding your hand. And then you black out from lack of sleep and excess of booze.
    
    `,
    image: 'medicine_card',
    options: [
      {
        text: 'Hello Darkness, my friend',
        effect: new MultiplexActivation([new ConcludeEventActivation(eventSink)]),
      },
    ],
  },

  PATROL: {
    id: 'PATROL',
    name: 'To serve and protect',
    playableByDirector: true,
    description: 'Suddenly a random group of law enforcement folks appear.',
    image: 'merchant_card',
    effect: new SpawnCardActivation(eventSink, {
      description: '',
      zone: 'streets',
      cardId: 'THE_LAW',
      spawnAnimation: 'fly_in_left',
    }),
  },

  MOLD_GROWS: {
    id: 'MOLD_GROWS',
    name: 'Mold grows',
    playableByDirector: true,
    description: 'Mold grows in Homunculus room.',
    image: 'poison_card',
    effect: new MultiplexActivation([
      new SpawnCardActivation(eventSink, {
        description: '',
        zone: 'alchemy',
        cardId: 'MOLD',
        spawnAnimation: 'pop_in',
      }),
    ]),
  },

  SHOPKEEPER: {
    id: 'SHOPKEEPER',
    name: 'Shopkeeper',
    description: `
"Ah, good day to you, sir!" the shopkeeper exclaims, his voice rich and warm, carrying the 
faintest trace of an accent from a bigger city than this. "Welcome to Woodley & Co., purveyors of the finest ingredients and curiosities. How may I assist you on this fine afternoon? Seeking something rare and potent, no doubt?"        
        `,
    image: 'medicine_card',
    options: [
      {
        text: 'Buy cured beef',
        effect: new MultiplexActivation([
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'home',
            cardId: 'FOOD',
          }),
          new ConcludeEventActivation(eventSink),
          new NextTurnActivation(),
        ]),
      },

      {
        text: 'Buy absinthe',
        effect: new MultiplexActivation([
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'home',
            cardId: 'ABSINTHE',
          }),
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'home',
            cardId: 'ABSINTHE',
          }),
          new ConcludeEventActivation(eventSink),
          new NextTurnActivation(),
        ]),
      },

      {
        text: 'Buy some alchemical supplies',
        effect: new MultiplexActivation([
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'home',
            cardId: 'ALCHEMICAL_SUPPLIES',
          }),
          new ConcludeEventActivation(eventSink),
          new NextTurnActivation(),
        ]),
      },
    ],
  },

  CRAFT_MUSHROOMS: {
    id: 'CRAFT_MUSHROOMS',
    name: 'CRAFT_MUSHROOMS',
    description: `
The alchemist's lab is a haven of controlled chaos, filled with the thick aroma of herbs and simmering brews. In the center of it stands a sturdy wooden workbench, its surface scarred from countless experiments.

The lab is bathed in the soft glow of gaslights, their flickering flames casting dancing shadows. You approach a well-worn tome, its pages filled with arcane recipes and notes. The Singing Mushrooms hold incredible potential - either to save lives, or to take them.        
        `,
    image: 'medicine_card',
    options: [
      {
        text: 'Create a life-saving medicine',
        effect: new MultiplexActivation([
          new QueueActivation(
            boardEventSink,
            new QueuedActivation({
              id: 'WORKBENCH_COOK_MEDICINE',
              unique: true,
              description: 'Need to let it simmer',
              activatesIn: 1,
              activation: new MultiplexActivation([
                new SetActiveCardActivation(false),
                //new PlaySfxActivation([SfxRegistry.POOF]),
                new SpawnCardActivation(eventSink, {
                  cardId: 'MEDICINE', // replace with explosives
                  description: 'Create 1 Medicine',
                  zone: 'lab',
                }),
              ]),
            }),
          ),
          new ConcludeEventActivation(eventSink),
          new SetActiveCardActivation(true),
        ]),
      },

      {
        text: 'Prepare deadly poison',
        effect: new MultiplexActivation([
          new QueueActivation(
            boardEventSink,
            new QueuedActivation({
              id: 'WORKBENCH_COOK_POISON',
              unique: true,
              description: 'Need to let it simmer',
              activatesIn: 1,
              activation: new MultiplexActivation([
                new SetActiveCardActivation(false),
                //new PlaySfxActivation([SfxRegistry.POOF]),
                new SpawnCardActivation(eventSink, {
                  cardId: 'POISON', // replace with explosives
                  description: 'Create 1 Poison',
                  zone: 'lab',
                }),
              ]),
            }),
          ),
          new ConcludeEventActivation(eventSink),
          new SetActiveCardActivation(true),
        ]),
      },
    ],
  },

  CRAFT_SUPPLIES: {
    id: 'CRAFT_SUPPLIES',
    name: 'CRAFT_SUPPLIES',
    description: `
        Today, you face a pivotal choice. Before you lay a selection of alchemical supplies, each with the potential to be transformed into a variety of creations: powerful explosives, potent booze, healing medicine, or deadly poison. The air is thick with anticipation, as you ponder the possibilities.
        `,
    image: 'medicine_card',
    options: [
      {
        text: 'Create a life-saving medicine',
        effect: new MultiplexActivation([
          new QueueActivation(
            boardEventSink,
            new QueuedActivation({
              id: 'WORKBENCH_COOK_MEDICINE',
              unique: true,
              description: 'Need to let it simmer',
              activatesIn: 1,
              activation: new MultiplexActivation([
                new SetActiveCardActivation(false),
                new SpawnCardActivation(eventSink, {
                  cardId: 'MEDICINE',
                  description: 'Create 1 Medicine',
                  zone: 'lab',
                }),
              ]),
            }),
          ),
          new ConcludeEventActivation(eventSink),
          new SetActiveCardActivation(true),
        ]),
      },

      {
        text: 'Prepare deadly poison',
        effect: new MultiplexActivation([
          new QueueActivation(
            boardEventSink,
            new QueuedActivation({
              id: 'WORKBENCH_COOK_POISON',
              unique: true,
              description: 'Need to let it simmer',
              activatesIn: 1,
              activation: new MultiplexActivation([
                new SetActiveCardActivation(false),
                //new PlaySfxActivation([SfxRegistry.POOF]),
                new SpawnCardActivation(eventSink, {
                  cardId: 'POISON', // replace with explosives
                  description: 'Create 1 Poison',
                  zone: 'lab',
                }),
              ]),
            }),
          ),
          new ConcludeEventActivation(eventSink),
          new SetActiveCardActivation(true),
        ]),
      },

      {
        text: 'Create explosives',
        effect: new MultiplexActivation([
          new QueueActivation(
            boardEventSink,
            new QueuedActivation({
              id: 'WORKBENCH_COOK_EXPLOSIVES',
              unique: true,
              description: 'Need to let it simmer',
              activatesIn: 1,
              activation: new MultiplexActivation([
                new SetActiveCardActivation(false),
                //new PlaySfxActivation([SfxRegistry.POOF]),
                new SpawnCardActivation(eventSink, {
                  cardId: 'EXPLOSIVES',
                  description: 'Create 1 Explosives',
                  zone: 'lab',
                }),
              ]),
            }),
          ),
          new ConcludeEventActivation(eventSink),
          new SetActiveCardActivation(true),
        ]),
      },

      {
        text: 'Brew booze',
        effect: new MultiplexActivation([
          new QueueActivation(
            boardEventSink,
            new QueuedActivation({
              id: 'WORKBENCH_COOK_ABSINTHE',
              unique: true,
              description: 'Need to let it simmer',
              activatesIn: 1,
              activation: new MultiplexActivation([
                new SetActiveCardActivation(false),
                //new PlaySfxActivation([SfxRegistry.POOF]),
                new SpawnCardActivation(eventSink, {
                  cardId: 'ABSINTHE',
                  amount: 3,
                  description: 'Create 3 Absinthe',
                  zone: 'lab',
                }),
              ]),
            }),
          ),
          new ConcludeEventActivation(eventSink),
          new SetActiveCardActivation(true),
        ]),
      },
    ],
  },

  CRAFT_FLOWERS: {
    id: 'CRAFT_FLOWERS',
    name: 'CRAFT_FLOWERS',
    description: `
Amidst the myriad of flasks and beakers, a basket sits prominently on the workbench, containing the latest specimen: the Watching Flower. With petals that seemed to shift and shimmer in the light, following every movement with an eerie accuracy, these flowers are both beautiful and unnerving.

You approach the basket with a mix of curiosity and caution. The Watching Flowers, with their unique properties, hold the potential for two vastly different creations: a volatile explosive or a potent brew.        
`,
    image: 'medicine_card',
    options: [
      {
        text: 'Create explosives',
        effect: new MultiplexActivation([
          new QueueActivation(
            boardEventSink,
            new QueuedActivation({
              id: 'WORKBENCH_COOK_EXPLOSIVES',
              unique: true,
              description: 'Need to let it simmer',
              activatesIn: 1,
              activation: new MultiplexActivation([
                new SetActiveCardActivation(false),
                //new PlaySfxActivation([SfxRegistry.POOF]),
                new SpawnCardActivation(eventSink, {
                  cardId: 'EXPLOSIVES', // replace with explosives
                  description: 'Create 1 Explosives',
                  zone: 'lab',
                }),
              ]),
            }),
          ),
          new ConcludeEventActivation(eventSink),
          new SetActiveCardActivation(true),
        ]),
      },

      {
        text: 'Brew booze',
        effect: new MultiplexActivation([
          new QueueActivation(
            boardEventSink,
            new QueuedActivation({
              id: 'WORKBENCH_COOK_ABSINTHE',
              unique: true,
              description: 'Need to let it simmer',
              activatesIn: 1,
              activation: new MultiplexActivation([
                new SetActiveCardActivation(false),
                //new PlaySfxActivation([SfxRegistry.POOF]),
                new SpawnCardActivation(eventSink, {
                  cardId: 'ABSINTHE', // replace with explosives
                  description: 'Create 1 Absinthe',
                  zone: 'lab',
                }),
              ]),
            }),
          ),
          new ConcludeEventActivation(eventSink),
          new SetActiveCardActivation(true),
        ]),
      },
    ],
  },

  CRAFT_MANDRAKE: {
    id: 'CRAFT_MANDRAKE',
    name: 'CRAFT_MANDRAKE',
    description: `
Today, your focus is on the newly acquired specimen: the Enlightened Mandrake. This rare root, with its humanoid shape and faint, ethereal glow, pulses with latent power. As you place it on the workbench, its gentle luminescence casts an otherworldly light.        
        `,
    image: 'medicine_card',
    options: [
      {
        text: 'Create a medicine',
        effect: new MultiplexActivation([
          new QueueActivation(
            boardEventSink,
            new QueuedActivation({
              id: 'WORKBENCH_COOK_MEDICINE',
              unique: true,
              description: 'Need to let it simmer',
              activatesIn: 1,
              activation: new MultiplexActivation([
                new SetActiveCardActivation(false),
                //new PlaySfxActivation([SfxRegistry.POOF]),
                new SpawnCardActivation(eventSink, {
                  cardId: 'MEDICINE', // replace with explosives
                  description: 'Create 1 Medicine',
                  zone: 'lab',
                }),
              ]),
            }),
          ),
          new ConcludeEventActivation(eventSink),
          new SetActiveCardActivation(true),
        ]),
      },

      {
        text: 'Prepare brew',
        effect: new MultiplexActivation([
          new QueueActivation(
            boardEventSink,
            new QueuedActivation({
              id: 'WORKBENCH_COOK_ABSINTHE',
              unique: true,
              description: 'Need to let it simmer',
              activatesIn: 1,
              activation: new MultiplexActivation([
                new SetActiveCardActivation(false),
                //new PlaySfxActivation([SfxRegistry.POOF]),
                new SpawnCardActivation(eventSink, {
                  cardId: 'ABSINTHE', // replace with explosives
                  description: 'Create 1 Absinthe',
                  zone: 'lab',
                }),
              ]),
            }),
          ),
          new ConcludeEventActivation(eventSink),
          new SetActiveCardActivation(true),
        ]),
      },
    ],
  },
} as const satisfies Record<string, EventDefinition>
