import {
  type Activation,
  type EventSink,
  MultiplexActivation,
  type Precondition,
} from '@potato-golem/core'
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
  options: EventOption[]
}

export type EventDefinitions = typeof eventDefinitions

export type EventId = keyof EventDefinitions

const eventSink: EventSink<EventEventId> = EventEmitters.eventViewEmitter

export const eventDefinitions = {
  INTRO: {
    id: 'INTRO',
    name: 'And so it begins',
    description: '[insert description of how homunculus began],',
    image: 'medicine_card',
    options: [
      {
        text: 'The world will pay for this',
        effect: new MultiplexActivation([
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'home',
            cardId: 'ANGER',
          }),
          new ConcludeEventActivation(eventSink),
        ]),
      },

      {
        text: 'I deserved this',
        effect: new MultiplexActivation([
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'home',
            cardId: 'HUMILITY',
          }),
          new ConcludeEventActivation(eventSink),
        ]),
      },
    ],
  },

  PATROL: {
    id: 'PATROL',
    name: 'To serve and protect',
    playableByDirector: true,
    description: 'Suddenly a random group of law enforcement folks appear.',
    image: 'merchant_card',
    options: [
      {
        text: 'The world will pay for this',
        effect: new MultiplexActivation([
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'streets',
            cardId: 'THE_LAW',
            spawnAnimation: 'fly_in_left',
          }),
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'home',
            cardId: 'ANGER',
          }),
          new ConcludeEventActivation(eventSink),
        ]),
      },

      {
        text: 'I deserved this',
        effect: new MultiplexActivation([
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'streets',
            cardId: 'THE_LAW',
            spawnAnimation: 'fly_in_left',
          }),
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'home',
            cardId: 'HUMILITY',
          }),
          new ConcludeEventActivation(eventSink),
        ]),
      },
    ],
  },

  MOLD_GROWS: {
    id: 'MOLD_GROWS',
    name: 'Mold grows',
    playableByDirector: true,
    description: 'Mold grows in Homunculus room.',
    image: 'poison_card',
    options: [
      {
        text: 'The world will pay for this',
        effect: new MultiplexActivation([
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'homunculus',
            cardId: 'MOLD',
            spawnAnimation: 'pop_in',
          }),
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'home',
            cardId: 'ANGER',
          }),
          new ConcludeEventActivation(eventSink),
        ]),
      },

      {
        text: 'I deserved this',
        effect: new MultiplexActivation([
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'streets',
            cardId: 'MOLD',
            spawnAnimation: 'pop_in',
          }),
          new SpawnCardActivation(eventSink, {
            description: '',
            zone: 'home',
            cardId: 'HUMILITY',
          }),
          new ConcludeEventActivation(eventSink),
        ]),
      },
    ],
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
        ]),
      },
    ],
  },
} as const satisfies Record<string, EventDefinition>
