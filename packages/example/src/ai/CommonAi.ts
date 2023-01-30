import { Operation } from '../model/worldState'

export type OperationsPlannerActivation = {
  planOperations(allowedBudget: number): Operation
}