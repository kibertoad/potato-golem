import { type EventSink, type TurnProcessor, generateUuid } from '@potato-golem/core'
import type { CommonEntity } from '@potato-golem/core'
import type { ChoiceDefinition } from '../definitions/01_district1/choiceDefinitions'
import { EntityTypeRegistry } from '../registries/entityTypeRegistry'

export type CardModelParams = {
  definition: ChoiceDefinition
  parentEventSink: EventSink
}

export class ChoiceModel implements TurnProcessor, CommonEntity {
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

  processTurn(): void {}
}
