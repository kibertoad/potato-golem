import { getEntityModel } from '@potato-golem/ui'
import { TargettedActivation } from '@potato-golem/core'
import { AbstractUIElementLite } from '@potato-golem/ui'
import { AbstractEmployee } from '../../../model/entities/AbstractEmployee'
import { TicketModel } from '../model/entities/TicketModel'

export class AssignEngineerActivation implements TargettedActivation<AbstractUIElementLite> {
  private readonly engineer: AbstractEmployee<any>

  constructor(engineer: AbstractEmployee<any>) {
    this.engineer = engineer
  }

  activate(targetTicketView: AbstractUIElementLite) {
    const targetTicket = getEntityModel<TicketModel>(targetTicketView)
    if (!targetTicket) {
      throw new Error('no entity model on view')
    }
    console.log('target ticket')
    console.log(targetTicket)

    if (!targetTicket.assignees.includes(this.engineer)) {
      targetTicket.assignees.push(this.engineer)
      console.log(`assigned ticket to ${this.engineer.name}`)
    }
  }
}
