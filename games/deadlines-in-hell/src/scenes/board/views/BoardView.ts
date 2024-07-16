import Phaser from 'phaser'

import { addGlobalTracker, RectangularGraphicsContainer } from '@potato-golem/ui'
import {
  DRAG_EVENTS,
  NinePatchBuilder,
  type PotatoScene,
  RectangularBuilder,
  type ViewParent,
  setEntityModel,
  setEntityType,
} from '@potato-golem/ui'
import { UiImages } from '../../../model/registries/ImageRegistry'
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import type { SwimlaneModel } from '../model/entities/SwimlaneModel'
import { TicketStatus } from '../model/entities/TicketModel'
import Sprite = Phaser.GameObjects.Sprite
import NineSlice = Phaser.GameObjects.NineSlice

export class BoardView implements ViewParent {
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
      .setSlices({
        width: 200,
        height: 600,
        bottomHeight: 10,
        leftWidth: 75,
        rightWidth: 30,
        topHeight: 100,
      })
      .build()

    console.log('9patch')
    console.log(JSON.stringify(boardNinePatch))

    this.ninePatches.push(boardNinePatch)

    const workingX = 100
    const workingY = 200

    const swimLane = RectangularBuilder.instance(this.scene)
      .addZone()
      .setPosition({
        x: 400,
        y: 100,
      })
      .setWidth(220)
      .setHeight(400)
      //.setBaseColour(0x8C5E58)
      .build()

    swimLane.zone.addListener(DRAG_EVENTS.ENTER_HOVER, () => {
      console.log('swimlane was hovered')
      swimLane.graphics.clear()
      swimLane.graphics.fillStyle(0x593d3b, swimLane.graphics.alpha)
      swimLane.graphics.fillRect(
        swimLane.rectangle.x,
        swimLane.rectangle.y,
        swimLane.rectangle.width,
        swimLane.rectangle.height,
      )
      swimLane.graphics.strokeRect(
        swimLane.rectangle.x,
        swimLane.rectangle.y,
        swimLane.rectangle.width,
        swimLane.rectangle.height,
      )
    })

    swimLane.zone.addListener(DRAG_EVENTS.LEAVE_HOVER, () => {
      console.log('swimlane was unhovered')
      swimLane.graphics.clear()
      swimLane.graphics.fillStyle(0x8c5e58, swimLane.graphics.alpha)
      swimLane.graphics.fillRect(
        swimLane.rectangle.x,
        swimLane.rectangle.y,
        swimLane.rectangle.width,
        swimLane.rectangle.height,
      )
      swimLane.graphics.strokeRect(
        swimLane.rectangle.x,
        swimLane.rectangle.y,
        swimLane.rectangle.width,
        swimLane.rectangle.height,
      )
    })

    const swimlaneModel: SwimlaneModel = {
      label: 'To Do',
      ticketStatus: TicketStatus.open,
    }

    setEntityType(swimLane.zone, EntityTypeRegistry.SWIMLANE)
    setEntityModel(swimLane.zone, swimlaneModel)

    addGlobalTracker(() => `SwimLaneX:${swimLane.rectangle.x};SwimLaneY:${swimLane.rectangle.y}`)
    addGlobalTracker(() => `SwimLaneWidth:${swimLane.rectangle.width};SwimLaneHeight:${swimLane.rectangle.height}`)

    // console.log(JSON.stringify(swimLane))
    this.swimlanes.push(swimLane)
  }
}
