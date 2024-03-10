import { NinePatchBuilder, PotatoScene, ViewParent, SpriteBuilder } from '@potato-golem/ui'
import { UiImages } from '../../../model/registries/ImageRegistry'
import Sprite = Phaser.GameObjects.Sprite
import NineSlice = Phaser.GameObjects.NineSlice

export class BoardView implements ViewParent{

  private readonly scene: PotatoScene
  private readonly sprites: Sprite[]
  private readonly ninePatches: NineSlice[]

  constructor(scene: PotatoScene) {
    this.sprites = []
    this.ninePatches = []

    const boardNinePatch = NinePatchBuilder.instance(scene)
      .setTextureKey(UiImages.roseWindow9Patch)
      .setPosition({
        x: 600,
        y: 400,
      })
      .setSlices(
        {
          width: 300,
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
  }

}
