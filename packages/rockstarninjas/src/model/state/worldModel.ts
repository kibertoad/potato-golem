import { AnalystModel, DeveloperModel, QaModel } from './employeeModel'
import { Ticket } from '../../scenes/board/model/entities/Ticket'

export type TeamModel = {
  analysts: AnalystModel[]
  qas: QaModel[]
  developers: DeveloperModel[]
}

export class WorldModel {
  public turnCounter: number
  public readonly tickets: Ticket[]
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
}

export const worldModel = new WorldModel()
