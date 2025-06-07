import { type EventSink, generateUuid } from '@potato-golem/core'
import type { CommonEntity } from '@potato-golem/core'
import { EntityTypeRegistry } from '../../registries/entityTypeRegistry'
import { StoryDefinition } from '../../definitions/zones/01_district1/district1StoryDefinitions'

export type CardModelParams = {
  definition: StoryDefinition
  parentEventSink: EventSink
}

/**
 * Story is a sequence of choices, that happen until story concludes
 * Some stories only happen once, while others are recurring
 * Story can be triggered by selection on a DailyChronicle or by picking an action in a
 */
export class StoryModel implements CommonEntity {
  type = EntityTypeRegistry.DEFAULT

  private readonly parentEventSink: EventSink
  readonly name: string
  readonly definition: StoryDefinition

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
