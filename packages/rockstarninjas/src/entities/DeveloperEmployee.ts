import { AbstractEmployee } from './AbstractEmployee'
import { DeveloperSkills } from '../model/employeeModel'
import { LimitedNumber, normalizedRandom } from '@potato-golem/core'

export class DeveloperEmployee extends AbstractEmployee<DeveloperSkills> {

  constructor() {
    super()

    this.coreSkills = {
      attention: new LimitedNumber(normalizedRandom(10), 10),
      architecture: new LimitedNumber(normalizedRandom(10), 10),
    }
  }
}
