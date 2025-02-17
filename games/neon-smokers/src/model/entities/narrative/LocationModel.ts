import { type EventSink, generateUuid } from '@potato-golem/core'
import type { CommonEntity } from '@potato-golem/core'
import { EntityTypeRegistry } from '../../registries/entityTypeRegistry'
import type { LocationDefinition } from '../../definitions/zones/common/LocationDefinition'

export type CardModelParams = {
  definition: LocationDefinition
}

/**
 * Location gives a list of stories to pick from
 * Usually location is connected to a specific zone and can be entered and left freely
 * Location typically has conditions to become visible, but do not have prerequisites
 * or consequences from doing so
 */
export class LocationModel implements CommonEntity {
  type = EntityTypeRegistry.DEFAULT

  private readonly parentEventSink: EventSink
  readonly name: string
  readonly definition: LocationDefinition

  id: string

  constructor(params: CardModelParams) {
    this.id = generateUuid()
    this.definition = params.definition
    this.name = this.definition.name
  }
}
