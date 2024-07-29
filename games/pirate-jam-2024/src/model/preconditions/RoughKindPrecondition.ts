import type { Precondition } from '@potato-golem/core'
import { worldModel } from '../state/WorldModel'

export class RoughKindPrecondition implements Precondition {
  isSatisfied(): boolean {
    const streetHasRoughKind = worldModel.zones.streets.hasCard('THE_ROUGH_KIND')
    if (streetHasRoughKind) {
      return false
    }

    const streetHasLaw = worldModel.zones.streets.hasCard('THE_LAW') || worldModel.zones.streets.hasCard('THE_RAID')
    if (streetHasLaw) {
      return false
    }

    return true
  }



}
