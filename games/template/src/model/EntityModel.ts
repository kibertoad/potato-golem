import { type EventSink, type TurnProcessor, generateUuid } from '@potato-golem/core'
import type { CommonEntity } from '@potato-golem/core'
import type { EntityDefinition } from './definitions/entityDefinitions'
import { EntityTypeRegistry } from './registries/entityTypeRegistry'

export type CardModelParams = {
  definition: EntityDefinition
  parentEventSink: EventSink
}

export class EntityModel implements TurnProcessor, CommonEntity {
  type = EntityTypeRegistry.DEFAULT

  private readonly parentEventSink: EventSink
  readonly name: string
  readonly definition: EntityDefinition

  id: string

  constructor(params: CardModelParams) {
    this.id = generateUuid()
    this.definition = params.definition
    this.name = this.definition.name
    this.parentEventSink = params.parentEventSink
  }

  destroy() {
    this.parentEventSink.emit('DESTROY', this)
  }

  processTurn(): void {}
}
