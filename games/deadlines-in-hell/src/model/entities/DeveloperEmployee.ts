import { LimitedNumber, normalizedRandom } from '@potato-golem/core'
import { ProgressType } from '../../scenes/board/model/entities/TicketModel'
import type { DeveloperSkills } from '../state/employeeModel'
import { AbstractEmployee } from './AbstractEmployee'

export class DeveloperEmployee extends AbstractEmployee<DeveloperSkills> {
  constructor() {
    super()

    this.area = ProgressType.development

    this.coreSkills = {
      attention: new LimitedNumber(normalizedRandom(10), 10),
      architecture: new LimitedNumber(normalizedRandom(10), 10),
    }
  }
}
