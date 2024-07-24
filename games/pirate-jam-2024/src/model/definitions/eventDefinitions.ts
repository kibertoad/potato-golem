import {
  type Activation,
  type EventSink,
  MultiplexActivation,
  type Precondition,
} from '@potato-golem/core'
import { ConcludeEventActivation, type EventEventId } from '../activations/event/eventActivations'
import { SpawnCardActivation } from '../activations/event/extraEventActivations'
import type { Dependencies } from '../diConfig'
import type { ImageId } from '../registries/imageRegistry'
import type { WorldModel } from '../state/WorldModel'

export type EventOption = {
  text: string
  effect: Activation
  conditions?: Precondition
}

export type EventDefinition = {
  name: string
  description: string
  image: ImageId
  options: EventOption[]
}

export type EventDefinitions = ReturnType<
  (typeof EventDefinitionGenerator.prototype)['generateDefinitions']
>

export type EventId = keyof EventDefinitions

export class EventDefinitionGenerator {
  protected readonly _worldModel: WorldModel

  constructor({ worldModel }: Dependencies) {
    this._worldModel = worldModel
  }

  generateDefinitions(eventSink: EventSink<EventEventId>) {
    return {
      INTRO: {
        name: 'And so it begins',
        description: '[insert description of how homunculus began],',
        image: 'medicine_card',
        options: [
          {
            text: 'The world will pay for this',
            effect: new MultiplexActivation([
              new SpawnCardActivation(eventSink, {
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
                zone: 'home',
                cardId: 'HUMILITY',
              }),
              new ConcludeEventActivation(eventSink),
            ]),
          },
        ],
      },

      SHOPKEEPER: {
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
                zone: 'home',
                cardId: 'HUMILITY',
              }),
              new ConcludeEventActivation(eventSink),
            ]),
          },

          {
            text: 'Buy a Bunsen burner',
            effect: new MultiplexActivation([
              new SpawnCardActivation(eventSink, {
                zone: 'home',
                cardId: 'HUMILITY',
              }),
              new ConcludeEventActivation(eventSink),
            ]),
          },

          {
            text: 'Buy an alembic',
            effect: new MultiplexActivation([
              new SpawnCardActivation(eventSink, {
                zone: 'home',
                cardId: 'HUMILITY',
              }),
              new ConcludeEventActivation(eventSink),
            ]),
          },
        ],
      },
    } as const satisfies Record<string, EventDefinition>
  }
}
