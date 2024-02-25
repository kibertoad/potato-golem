import { normalizedRandom } from '@potato-golem/core'
import { Activation } from '@potato-golem/ui'
import { WorldModel } from '../../../model/state/worldModel'

export class NextTurnActivation implements Activation {
  private readonly worldModel: WorldModel

  constructor(worldModel: WorldModel) {
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
    }
  }

  activate(): void {
    this.processTickets()

    this.worldModel.turnCounter++

    console.log(`Current turn: ${this.worldModel.turnCounter}`)
  }
}
