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
  impact: number, // strong sense of business value - increases impact of tasks
  speed: number, // speeds up analysis
  clarity: number, // reduces amount of bugs in implementation
}

export type QaSkills = {
  automation: number, // reduces amount of bugs in future related tasks
  speed: number, // speeds up testing
  attention: number, // reduces amount of escaped defects
}

export type DeveloperSkills = {
  architecture: number, // reduces amount of technical debt generated
  speed: number, // speeds up development
  attention: number, // reduces amount of escaped defects
}

export type EmployeeModel = {
  name: string
  alias: string
  seniority: Seniority
  motivation: LimitedNumber
  knowledge: LimitedNumber
  health: LimitedNumber
}

export type AnalystModel = EmployeeModel & AnalystSkills
export type QaModel = EmployeeModel & QaSkills
export type DeveloperModel = EmployeeModel & DeveloperSkills
