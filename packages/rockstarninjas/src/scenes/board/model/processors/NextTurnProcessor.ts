import { Dependencies } from '../../../../model/diConfig'
import { normalizedRandom, Processor } from '@potato-golem/core'
import { ProgressType } from '../entities/TicketModel'

export class NextTurnProcessor implements Processor{
  private readonly worldModel

  constructor({ worldModel }: Dependencies) {
    this.worldModel = worldModel
  }

  processTickets() {
    for (const ticket of this.worldModel.tickets) {
      if (ticket.assignees.length === 0) {
        continue
      }

      const leadAssignee = ticket.assignees[0]

      // ToDo more complex logic based on seniority, taking into consideration potential blocking and assisting engineers

      const progress = normalizedRandom(leadAssignee.coreSkills.speed.value)

      ticket.addProgress(progress, ProgressType.development)
    }
  }

  process() {
    this.processTickets()

    this.worldModel.turnCounter++

    console.log(`Current turn: ${this.worldModel.turnCounter}`)
  }
}
