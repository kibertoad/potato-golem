import { LimitedNumber, normalizedRandom } from '@potato-golem/core'
import { ProgressType } from '../../scenes/board/model/entities/TicketModel'
import type { AnalystSkills } from '../state/employeeModel'
import { AbstractEmployee } from './AbstractEmployee'

export class AnalystEmployee extends AbstractEmployee<AnalystSkills> {
  constructor() {
    super()

    this.area = ProgressType.analysis

    this.coreSkills = {
      impact: new LimitedNumber(normalizedRandom(10), 10),
      clarity: new LimitedNumber(normalizedRandom(10), 10),
    }
  }
}
