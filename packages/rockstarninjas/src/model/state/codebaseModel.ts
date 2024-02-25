import { LimitedNumber } from '@potato-golem/core'

export type Module = {
  name: string
  technicalDebt: number
  businessImpact: number
  progress: LimitedNumber
}

export enum Severity {
  blocker = 0,
  major = 1,
  minor = 2,
  trivial = 3,
}

export type Defect = {
  name: string
  severity: Severity
  module: Module
  progress: LimitedNumber
}

export type CodebaseModel = {
  modules: Module[]
  defects: Defect[]
}
