import { ProgressType, type TicketModel } from '../../scenes/board/model/entities/TicketModel'
import type { AnalystModel, DeveloperModel, EmployeeModel, QaModel } from './employeeModel'

export type TeamModel = {
  analysts: AnalystModel[]
  qas: QaModel[]
  developers: DeveloperModel[]
}

export class WorldModel {
  public turnCounter: number
  public readonly tickets: TicketModel[]
  public readonly teamModel: TeamModel

  constructor() {
    this.turnCounter = 1
    this.tickets = []
    this.teamModel = {
      qas: [],
      analysts: [],
      developers: [],
    }
  }

  addTicket(ticket: TicketModel) {
    this.tickets.push(ticket)
  }

  addEmployee(employee: EmployeeModel<unknown>) {
    switch (employee.area) {
      case ProgressType.analysis:
        this.teamModel.analysts.push(employee as AnalystModel)
        break

      case ProgressType.development:
        this.teamModel.developers.push(employee as DeveloperModel)
        break

      case ProgressType.testing:
        this.teamModel.qas.push(employee as QaModel)
        break

      default:
        throw new Error(`Unknown area: ${employee.area}`)
    }
  }
}
