import { LimitedNumber } from '@potato-golem/core'
import type { EmployeeModel } from '../../../../model/state/employeeModel'

export enum TicketStatus {
  open = 'open',
  analysis = 'analysis',
  development = 'development',
  testing = 'testing',
  released = 'released',
}

export enum ProgressType {
  analysis = 'analysis',
  development = 'development',
  testing = 'testing',
}

export type TicketParams = {
  name: string
  complexity: number
}

export class TicketModel {
  assignees: EmployeeModel<unknown>[]
  progress: Record<ProgressType, LimitedNumber>
  status: TicketStatus = TicketStatus.open
  params: TicketParams

  constructor(params: TicketParams) {
    this.params = params

    this.assignees = []
    this.progress = {
      analysis: new LimitedNumber(0, 10),
      development: new LimitedNumber(0, 10),
      testing: new LimitedNumber(0, 10),
    }
  }

  addProgress(progress: number, progressType: ProgressType) {
    this.progress[progressType].increase(progress)
  }

  canBeAnalyzed() {
    return !this.progress.analysis.isAtMax()
  }

  canBeDeveloped() {
    return !this.progress.development.isAtMax()
  }

  canBeTested() {
    return !this.progress.testing.isAtMax()
  }
}
