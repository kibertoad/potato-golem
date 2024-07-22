import type { EventReceiver, Prioritized, TargettedActivation } from '@potato-golem/core'

export abstract class EntityActivation implements Prioritized, TargettedActivation<EventReceiver> {
  abstract isExclusive?: boolean
  abstract priority: number

  abstract activate(target: EventReceiver): void
}
