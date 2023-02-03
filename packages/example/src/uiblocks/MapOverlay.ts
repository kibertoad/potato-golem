import {
  ButtonBuilder, CommonUIGroup,
  Position,
} from '@potato-golem/extras'
import { territories } from '../model/territories'

export class MapOverlay extends CommonUIGroup{

  private readonly territoryList: Phaser.GameObjects.Image[] = []

  static build(scene: Phaser.Scene, startingPosition: Position) {
    const { width, height } = scene.scale;
    const mapOverlay = new MapOverlay()

    for (let territory of Object.entries(territories)) {
      const [territoryId, definition] = territory

      const newButton = new ButtonBuilder(scene, mapOverlay.children, mapOverlay.territoryList)
        .text(definition.name)
        .textureKey("glass-panel")
        .displaySize(definition.sizeX, definition.sizeY)
        .position(startingPosition.x + definition.positionX, startingPosition.x + definition.positionY)
        .build()
    }

    return mapOverlay
  }

}