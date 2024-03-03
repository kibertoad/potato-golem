import { getEntityModel } from '@potato-golem/ui'
import {
  TargettedActivation,
} from '@potato-golem/ui/dist/src/ui/activations/ActivationTypes'
import { AbstractUIElementLite } from '@potato-golem/ui/dist/src/ui/elements/UIGroup'
import { AbstractEmployee } from '../../../model/entities/AbstractEmployee'
import { Ticket } from '../model/entities/Ticket'

export class AssignEngineerActivation implements TargettedActivation<AbstractUIElementLite> {
  private readonly engineer: AbstractEmployee<any>

  constructor(engineer: AbstractEmployee<any>) {
    this.engineer = engineer
  }

  activate(targetTicketView: AbstractUIElementLite) {
    const targetTicket = getEntityModel<Ticket>(targetTicketView)
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
