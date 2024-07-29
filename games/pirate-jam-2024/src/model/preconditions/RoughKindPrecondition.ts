import type { Precondition } from '@potato-golem/core'
import { worldModel } from '../state/WorldModel'

export class RoughKindPrecondition implements Precondition {
  isSatisfied(): boolean {
    console.log('Checkety check')

    const streetHasRoughKind = worldModel.zones.streets.hasCard('THE_ROUGH_KIND')
    if (streetHasRoughKind) {
      return false
    }
    console.log('No rough kind')

    const streetHasLaw = worldModel.zones.streets.hasCard('THE_LAW') || worldModel.zones.streets.hasCard('THE_RAID')
    if (streetHasLaw) {
      return false
    }
    console.log('No law')

    return true
  }



}
