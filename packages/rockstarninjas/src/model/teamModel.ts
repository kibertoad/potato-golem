import { AnalystModel, DeveloperModel, QaModel } from './employeeModel'

export type TeamModel = {
  analysts: AnalystModel[]
  qas: QaModel[]
  developers: DeveloperModel[]
}
