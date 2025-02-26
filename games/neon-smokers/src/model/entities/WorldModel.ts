import { removeFromArrayById } from '@potato-golem/core'
import  { ChoiceModel } from './narrative/ChoiceModel'
import {ZoneBundle} from "../definitions/zones/common/ZoneBundle";
import {LocationDefinition} from "../definitions/zones/common/LocationDefinition";
import {district1Bundle} from "../definitions/zones/01_district1/district1Bundle";

export class WorldModel {
  public currentZone: ZoneBundle
  public currentLocation?: LocationDefinition

  public readonly choices: ChoiceModel[] = []


  constructor() {
    this.currentZone = district1Bundle
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
