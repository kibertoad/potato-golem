import { LimitedNumber, RegistryEntityId, removeFromArrayById } from '@potato-golem/core'
import  { ChoiceModel } from './narrative/ChoiceModel'
import {ZoneBundle} from "../definitions/zones/common/ZoneBundle";
import {LocationDefinition} from "../definitions/zones/common/LocationDefinition";
import {district1Bundle} from "../definitions/zones/01_district1/district1Bundle";
import { stateDefinitions, stateRegistry } from '../definitions/state/StateDefinition'

export class WorldModel {
  public currentZone: ZoneBundle
  public currentLocation?: LocationDefinition

  public readonly playerStates: Record<RegistryEntityId<typeof stateRegistry>, LimitedNumber>
  public readonly choices: ChoiceModel[] = []

  constructor() {
    this.currentZone = district1Bundle
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
}

export const worldModel = new WorldModel()
