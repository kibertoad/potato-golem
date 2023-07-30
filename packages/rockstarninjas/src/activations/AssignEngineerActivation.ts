import { Ticket } from '../entities/Ticket'
import { TargettedActivation, TargettedActivationCallback } from '@potato-golem/ui/dist/src/ui/activations/ActivationTypes'
import { EmployeeModel } from '../model/employeeModel'

export class AssignEngineerActivation implements TargettedActivation<EmployeeModel> {
  private readonly ticket: Ticket

  constructor(ticket: Ticket) {
    this.ticket = ticket
  }

  activate(target: EmployeeModel) {
    if (!this.ticket.assignees.includes(target)) {
      this.ticket.assignees.push(target)
      console.log('assigned ticket')
    }
  }
}
