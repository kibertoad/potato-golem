import type { EventReceiver, Prioritized, TargettedActivation } from '@potato-golem/core'
import type { CardModel } from '../entities/CardModel'

export abstract class EntityActivation implements Prioritized, TargettedActivation<EventReceiver> {
  abstract isExclusive?: boolean
  abstract priority: number

  abstract activate(target: EventReceiver): void
}
