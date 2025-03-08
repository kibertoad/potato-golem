import type { WorldModel } from '../entities/WorldModel'
import { district1Bundle } from '../definitions/zones/01_district1/district1Bundle'

export function populateStartGame(worldModel: WorldModel) {
  worldModel.setZone(district1Bundle)
}
