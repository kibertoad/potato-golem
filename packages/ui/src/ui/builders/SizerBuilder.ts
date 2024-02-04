import { validateNumber } from 'validation-utils'
import { PotatoScene } from '../common/PotatoScene'
import { COLOR_DARK, COLOR_LIGHT } from '../constants/Colours'
import { AbstractUIBuilder } from './AbstractUIBuilder'
import { ImageBoxBuilder } from './ImageBoxBuilder'

export type RowDefinition = {
  icon?: string
  proportion?: number
  iconWidth?: number
  iconHeight?: number
  iconOffsetX?: number
  text?: string
  alpha?: number
}

export class SizerBuilder extends AbstractUIBuilder {
  private rowDefinitions: RowDefinition[]

  constructor(scene: PotatoScene) {
    super(scene)
    this.rowDefinitions = []
  }

  addRow(row: RowDefinition) {
    this.rowDefinitions.push({ ...row })
    return this
  }

  build() {
    const rowCount = 3 // Change it to 3, 5, 10

    const sizer = this.scene.rexUI.add.sizer({
      x: this.getX(),
      y: this.getY(),
      width: this.getWidth(),
      height: this.getHeight(),
      orientation: 1,
    })

    for (const row of this.rowDefinitions) {
      sizer.add(this.createLabel(this.scene, row), {
        proportion: row.proportion ?? 1,
        expand: true,
        //  align: row.icon ? 'center-center' : 'center-center'
      })
    }

    sizer.layout()
  }

  createLabel(scene: PotatoScene, row: RowDefinition) {
    let icon
    if (row.icon) {
      icon = new ImageBoxBuilder(scene)
        .setTextureKey(row.icon)
        .setPosition({
          x: 0,
          y: 0,
        })
        .setWidth(validateNumber(row.iconWidth))
        .setHeight(validateNumber(row.iconHeight))
        .build()
        .setDepth(1)
    }

    return scene.rexUI.add.label({
      background: scene.rexUI.add
        .roundRectangle(0, 0, 0, 0, 0, COLOR_DARK, row.alpha ?? 1)
        .setDepth(0), //{ strokeColor: COLOR_LIGHT }),
      text: row.text ? scene.add.text(0, 0, row.text).setWordWrapWidth(this.getWidth()) : undefined,
      icon: icon ? icon : undefined,
      squareFitIcon: true,
      space: {
        left: row.iconOffsetX ? row.iconOffsetX : 10,
        right: 10,
        top: 10,
        bottom: 10,
        icon: 10,
        text: 10,
      },
    })
  }
}
