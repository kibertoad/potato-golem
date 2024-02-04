import { LimitedNumber, normalizedRandom, randomOneOf } from '@potato-golem/core'
import { genNames } from 'generate-human-names'
import { generateDirector } from '../generators/directorGenerator'
import { EmployeeModel, EmployeeSkills, Seniority } from '../model/employeeModel'
import { Gender } from '../registries/ImageRegistry'

export abstract class AbstractEmployee<CoreSkills> implements EmployeeModel<CoreSkills> {
  public commonSkills: EmployeeSkills
  public coreSkills: CoreSkills
  public name: string
  public alias: string
  public seniority: Seniority

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
