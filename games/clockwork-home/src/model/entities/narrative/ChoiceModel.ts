import { type EventSink, generateUuid } from '@potato-golem/core'
import type { CommonEntity } from '@potato-golem/core'
import type { ChoiceDefinition } from '../../definitions/zones/01_district1/district1ChoiceDefinitions'
import { EntityTypeRegistry } from '../../registries/entityTypeRegistry'

export type CardModelParams = {
  definition: ChoiceDefinition
  parentEventSink: EventSink
}

/**
 * Choice can be shown or hidden conditionally
 * Choice can have prerequisites to become active
 * Choice may conclude a story or transition it to a different state
 **/
export class ChoiceModel implements CommonEntity {
  type = EntityTypeRegistry.DEFAULT

  private readonly parentEventSink: EventSink
  readonly name: string
  readonly definition: ChoiceDefinition

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
}
