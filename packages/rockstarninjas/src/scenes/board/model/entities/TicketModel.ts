import { LimitedNumber } from '@potato-golem/core'
import { EmployeeModel } from '../../../../model/state/employeeModel'

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
  testing = 'testing'
}

export class TicketModel {
  assignees: EmployeeModel<any>[]
  complexity: number
  progress: Record<ProgressType, LimitedNumber>
  status: TicketStatus = TicketStatus.open

  constructor() {
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
