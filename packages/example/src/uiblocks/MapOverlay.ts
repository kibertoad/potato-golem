import {
  ButtonBuilder,
  ButtonListBuilder,
  ButtonSquareBuilder,
  ChangeSceneActivation,
  Position,
} from '@potato-golem/core'
import { technologies } from '../model/technologies'
import { territories } from '../model/territories'

export class MapOverlay {

  static build(scene: Phaser.Scene, startingPosition: Position) {
    const { width, height } = scene.scale;
    const territoryList: Phaser.GameObjects.Image[]  = []

    for (let territory of Object.entries(territories)) {
      const [territoryId, definition] = territory

      const newButton = new ButtonBuilder(scene, territoryList)
        .text(definition.name)
        .textureKey("glass-panel")
        .displaySize(definition.sizeX, definition.sizeY)
        .position(startingPosition.x + definition.positionX, startingPosition.x + definition.positionY)
        .build()
    }

    return territoryList
  }

}