import { LimitedNumber } from '@potato-golem/core'
import { EmployeeModel } from '../../../../model/state/employeeModel'

export enum TicketStatus {
  open = 'open',
  analysis = 'analysis',
  development = 'development',
  testing = 'testing',
  released = 'released',
}

export class Ticket {
  assignees: EmployeeModel<any>[]
  complexity: number
  progress: {
    analysis: LimitedNumber
    development: LimitedNumber
    testing: LimitedNumber
  }
  status: TicketStatus = TicketStatus.open

  constructor() {
    this.assignees = []
    this.progress = {
      analysis: new LimitedNumber(0, 10),
      development: new LimitedNumber(0, 10),
      testing: new LimitedNumber(0, 10),
    }
  }
}
