import { type Processor, normalizedRandom } from '@potato-golem/core'
import type { Dependencies } from '../../../../model/diConfig'
import type { WorldModel } from '../../../../model/state/worldModel'

export class NextTurnProcessor implements Processor {
  private readonly worldModel: WorldModel

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

      const progress = normalizedRandom(leadAssignee.commonSkills.speed.value)

      ticket.addProgress(progress, leadAssignee.area)

      console.log(`Ticket ${ticket.params.name} progress: ${JSON.stringify(ticket.progress)}`)
    }
  }

  process() {
    this.processTickets()

    this.worldModel.turnCounter++

    console.log(`Current turn: ${this.worldModel.turnCounter}`)
  }
}
