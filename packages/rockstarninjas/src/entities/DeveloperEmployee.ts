import { LimitedNumber, normalizedRandom } from '@potato-golem/core'
import { DeveloperSkills } from '../model/employeeModel'
import { AbstractEmployee } from './AbstractEmployee'

export class DeveloperEmployee extends AbstractEmployee<DeveloperSkills> {
  constructor() {
    super()

    this.coreSkills = {
      attention: new LimitedNumber(normalizedRandom(10), 10),
      architecture: new LimitedNumber(normalizedRandom(10), 10),
    }
  }
}
