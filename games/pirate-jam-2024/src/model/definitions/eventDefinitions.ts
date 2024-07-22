import type { EventSink, Precondition, TargettedActivation } from '@potato-golem/core'
import { ConcludeEventActivation, type EventEventId } from '../activations/event/eventActivations'
import type { Dependencies } from '../diConfig'
import type { ImageId } from '../registries/imageRegistry'
import type { WorldModel } from '../state/WorldModel'

export type EventOption = {
  text: string
  effect: TargettedActivation<EventDefinition>
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
  private readonly _worldModel: WorldModel

  constructor({ worldModel }: Dependencies) {
    this._worldModel = worldModel
  }

  generateDefinitions(eventSink: EventSink<EventEventId>) {
    return {
      INTRO: {
        name: 'And so it begins',
        description: '[insert description of how homunculus began],',
        image: 'corpse_card',
        options: [
          {
            text: 'Just great',
            effect: new ConcludeEventActivation(eventSink),
          },
        ],
      },
    } as const satisfies Record<string, EventDefinition>
  }
}