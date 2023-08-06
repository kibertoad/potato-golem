import { LimitedNumber } from '@potato-golem/core'

export enum Seniority {
  junior = 1,
  middle = 2,
  senior = 3,
  staff = 4,
  principal = 5,
}

export enum Profession {
  analyst = 'analyst',
  qa = 'qa',
  developer = 'developer',
}

export type AnalystSkills = {
  impact: LimitedNumber, // strong sense of business value - increases impact of tasks
  clarity: LimitedNumber, // reduces amount of bugs in implementation
}

export type QaSkills = {
  automation: LimitedNumber, // reduces amount of bugs in future related tasks
  attention: LimitedNumber, // reduces amount of escaped defects
}

export type DeveloperSkills = {
  architecture: LimitedNumber, // reduces amount of technical debt generated
  attention: LimitedNumber, // reduces amount of escaped defects
}

export type EmployeeModel<CoreSkills> = {
  name: string
  alias: string
  seniority: Seniority
  commonSkills: EmployeeSkills
  coreSkills: CoreSkills
}

export type EmployeeSkills = {
  motivation: LimitedNumber
  knowledge: LimitedNumber
  health: LimitedNumber
  speed: LimitedNumber, // speeds up analysis
}

export type AnalystModel = EmployeeModel<AnalystSkills>
export type QaModel = EmployeeModel<QaSkills>
export type DeveloperModel = EmployeeModel<DeveloperSkills>
