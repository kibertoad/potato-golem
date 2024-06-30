import {
  NinePatchBuilder,
  PotatoScene,
  ViewParent,
  SpriteBuilder,
  RectangularBuilder,
  buildOnHover,
} from '@potato-golem/ui'
import { UiImages } from '../../../model/registries/ImageRegistry'
import Sprite = Phaser.GameObjects.Sprite
import NineSlice = Phaser.GameObjects.NineSlice
import type { RectangularGraphicsContainer } from '@potato-golem/ui'

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
      .setPosition({
        x: 100,
        y: 200,
      })
      .setWidth(220)
      .setHeight(400)
      //.setBaseColour(0x8C5E58)
      .build()

    // ToDo Graphics object need manual onPointer check, they don't get hovered events automatically

    /*
    buildOnDragHover(swimLane, EntityTypeRegistry.TICKET,
      () => {
        console.log('hhh')
        swimLane.fillStyle(0xff0000, 1.0)
      },
      () => {
      console.log('unh')
        swimLane.fillStyle(0xD3D3D3, 1.0)
      },
    {
      tolerance: 10,
    }
    )

    buildOnHover(swimLane,
      () => {
        console.log('hhh')
        swimLane.fillStyle(0xff0000, 1.0)
      },
      () => {
        console.log('unh')
        swimLane.fillStyle(0xD3D3D3, 1.0)
      },
      {
        tolerance: 10,
      }
    )

     */

    console.log(JSON.stringify(swimLane))
    this.swimlanes.push(swimLane)
  }

}
