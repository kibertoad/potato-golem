import {
  removeFromArrayById,
  StateTracker,
  type StateValues,
} from '@potato-golem/core'
import type { ChoiceModel } from './narrative/ChoiceModel'
import type {ZoneBundle} from "../definitions/zones/common/ZoneBundle";
import type {LocationDefinition} from "../definitions/zones/common/LocationDefinition";
import { stateDefinitions, stateRegistry } from '../definitions/state/StateDefinition'

export class WorldModel {
  public currentZone: ZoneBundle
  public currentLocation?: LocationDefinition

  public readonly playerStateTracker: StateTracker<typeof stateRegistry>
  public readonly playerStates: StateValues<typeof stateRegistry>
  public readonly choices: ChoiceModel[] = []

  constructor() {
    this.playerStateTracker = new StateTracker(stateRegistry, stateDefinitions)
    this.playerStates = this.playerStateTracker.states

    this.playerStates.energy.setValue(10)
    this.playerStates.health.setValue(10)
    this.playerStates.sanity.setValue(10)
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

  setLocation(newLocation: LocationDefinition | undefined) {
    this.currentLocation = newLocation
  }
}

export const worldModel = new WorldModel()
