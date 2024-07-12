import { LimitedNumber, normalizedRandom } from '@potato-golem/core'
import { ProgressType } from '../../scenes/board/model/entities/TicketModel'
import type { QaSkills } from '../state/employeeModel'
import { AbstractEmployee } from './AbstractEmployee'

export class QaEmployee extends AbstractEmployee<QaSkills> {
  constructor() {
    super()

    this.area = ProgressType.development

    this.coreSkills = {
      attention: new LimitedNumber(normalizedRandom(10), 10),
      automation: new LimitedNumber(normalizedRandom(10), 10),
    }
  }
}
