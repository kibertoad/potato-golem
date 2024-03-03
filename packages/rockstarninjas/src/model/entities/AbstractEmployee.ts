import { LimitedNumber, normalizedRandom, randomOneOf } from '@potato-golem/core'
import { genNames } from 'generate-human-names'
import { ProgressType } from '../../scenes/board/model/entities/TicketModel'
import { Gender } from '../registries/ImageRegistry'
import { EmployeeModel, EmployeeSkills, Seniority } from '../state/employeeModel'

export abstract class AbstractEmployee<CoreSkills> implements EmployeeModel<CoreSkills> {
  public commonSkills: EmployeeSkills
  public coreSkills: CoreSkills
  public name: string
  public alias: string
  public seniority: Seniority
  public area: ProgressType

  constructor() {
    const gender = randomOneOf(Object.values(Gender))
    const [name] = genNames({
      gender,
      surname: true,
      count: 1,
    })

    this.name = name.first
    this.alias = 'Drone'
    this.seniority = normalizedRandom(Object.values(Seniority).length)

    this.commonSkills = {
      speed: new LimitedNumber(normalizedRandom(10), 10),
      motivation: new LimitedNumber(normalizedRandom(10), 10),
      health: new LimitedNumber(normalizedRandom(10), 10),
      knowledge: new LimitedNumber(normalizedRandom(10), 10),
    }
  }
}
