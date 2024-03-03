import { TicketModel } from '../../scenes/board/model/entities/TicketModel'
import { AnalystModel, DeveloperModel, QaModel } from './employeeModel'

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
}
