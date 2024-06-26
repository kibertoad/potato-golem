import {
  NinePatchBuilder,
  PotatoScene,
  ViewParent,
  SpriteBuilder,
  RectangularBuilder,
  buildOnHover, DRAG_EVENTS, buildOnDragHover, setEntityType, setEntityModel,
} from '@potato-golem/ui'
import { UiImages } from '../../../model/registries/ImageRegistry'
import Sprite = Phaser.GameObjects.Sprite
import NineSlice = Phaser.GameObjects.NineSlice
import type { RectangularGraphicsContainer } from '@potato-golem/ui'
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import { SwimlaneModel } from '../model/entities/SwimlaneModel'

export class BoardView implements ViewParent{

  private readonly scene: PotatoScene
  private readonly sprites: Sprite[]
  private readonly ninePatches: NineSlice[]
  public readonly swimlanes: RectangularGraphicsContainer[]

  constructor(scene: PotatoScene) {
    this.scene = scene
    this.sprites = []
    this.ninePatches = []
    this.swimlanes = []

    const boardNinePatch = NinePatchBuilder.instance(this.scene)
      .setTextureKey(UiImages.roseWindow9Patch)
      .setPosition({
        x: 600,
        y: 400,
      })
      .setSlices(
        {
          width: 200,
          height: 600,
          bottomHeight: 10,
          leftWidth: 75,
          rightWidth: 30,
          topHeight: 100
        }
        )
      .build()

    console.log('9patch')
    console.log(JSON.stringify(boardNinePatch))

    this.ninePatches.push(boardNinePatch)

    const swimLane = RectangularBuilder.instance(this.scene)
      .addZone()
      .setPosition({
        x: 100,
        y: 200,
      })
      .setWidth(220)
      .setHeight(400)
      //.setBaseColour(0x8C5E58)
      .build()

    swimLane.zone.addListener(DRAG_EVENTS.ENTER_HOVER, () => {
      console.log('swimlane was hovered')
      swimLane.graphics.clear();
      swimLane.graphics.fillStyle(0x593D3B, swimLane.graphics.alpha);
      swimLane.graphics.fillRect(swimLane.rectangle.x, swimLane.rectangle.y, swimLane.rectangle.width, swimLane.rectangle.height);
      swimLane.graphics.strokeRect(swimLane.rectangle.x, swimLane.rectangle.y, swimLane.rectangle.width, swimLane.rectangle.height);
    })

    swimLane.zone.addListener(DRAG_EVENTS.LEAVE_HOVER, () => {
      console.log('swimlane was unhovered')
      swimLane.graphics.clear();
      swimLane.graphics.fillStyle(0x8C5E58, swimLane.graphics.alpha);
      swimLane.graphics.fillRect(swimLane.rectangle.x, swimLane.rectangle.y, swimLane.rectangle.width, swimLane.rectangle.height);
      swimLane.graphics.strokeRect(swimLane.rectangle.x, swimLane.rectangle.y, swimLane.rectangle.width, swimLane.rectangle.height);
    })

    const swimlaneModel: SwimlaneModel = {
      label: 'To Do'
    }

    setEntityType(swimLane.zone, EntityTypeRegistry.SWIMLANE)
    setEntityModel(swimLane.zone, swimlaneModel)

    // console.log(JSON.stringify(swimLane))
    this.swimlanes.push(swimLane)
  }

}
