import { LimitedNumber, type RegistryEntityId, removeFromArrayById } from '@potato-golem/core'
import type { ChoiceModel } from './narrative/ChoiceModel'
import type {ZoneBundle} from "../definitions/zones/common/ZoneBundle";
import type {LocationDefinition} from "../definitions/zones/common/LocationDefinition";
import { stateDefinitions, stateRegistry } from '../definitions/state/StateDefinition'

export class WorldModel {
  public currentZone: ZoneBundle
  public currentLocation?: LocationDefinition

  public readonly playerStates: Record<RegistryEntityId<typeof stateRegistry>, LimitedNumber>
  public readonly choices: ChoiceModel[] = []

  constructor() {
    // @ts-ignore
    this.playerStates = {}
    for (const stateId of Object.values(stateRegistry)) {
      this.playerStates[stateId] = new LimitedNumber(0, stateDefinitions[stateId].maxAmount, false)
    }

    this.playerStates.energy.setValue(10)
    this.playerStates.euros.setValue(1000)
  }

  addChoice(cardModel: ChoiceModel) {
    this.choices.push(cardModel)
  }

  /**
   * Remove entity by unique id
   */
  removeEntity(entityModelId: string): ChoiceModel {
    return removeFromArrayById(this.choices, entityModelId)
  }

  setZone(zone: ZoneBundle) {
    this.currentZone = zone
  }
}

export const worldModel = new WorldModel()
