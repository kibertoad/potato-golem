import { PotatoScene } from '@potato-golem/ui/dist/src/ui/common/PotatoScene'
import { Director } from '../generators/directorGenerator'
import { ImageBoxBuilder, Position, SizerBuilder } from '@potato-golem/ui'

export class VpPositionWindow {

  static build(scene: PotatoScene, startingPosition: Position, vp: Director) {
    const window = new VpPositionWindow()

    const sizerBuilder = new SizerBuilder(scene)
      .setPosition({
        x: startingPosition.x,
        y: startingPosition.y
      })
      .addRow({
        icon: vp.icon,
        iconWidth: 100,
        iconHeight: 100,
        iconOffsetX: 20,
        proportion: 4
      })
      .addRow({
        text: 'They approve of the proposal',
        proportion: 1
      })
      .addRow({
        text: 'For',
        proportion: 5
      })
      .addRow({
        text: 'Against',
        proportion: 5
      })
      .addRow({
        text: 'Consequences',
        proportion: 3
      })
      .setWidth(170)
      .setHeight(700)
      .build()

    return window
  }

}
