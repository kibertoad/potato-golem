import { PotatoScene } from '../common/PotatoScene'
import { AbstractUIBuilder } from './AbstractUIBuilder'
import { validateNumber } from 'validation-utils'

export class NameValueLabelBuilder extends AbstractUIBuilder {

  private text?: string

  constructor(scene: PotatoScene) {
    super(scene)
  }

  public setText(value: string) {
    this.text = value
    return this
  }

  build() {
    // @ts-ignore
    // @ts-ignore
    const label0 = this.scene.rexUI.add.nameValueLabel({
      x: validateNumber(this.position?.x), y: validateNumber((this.position?.y)),
      width: validateNumber(this.width), height: validateNumber(this.height),

      background: this.scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20).setStrokeStyle(2, 0xa98274),

      icon: this.scene.add.rectangle(0, 0, 20, 20, 0xa98274),

      // @ts-ignore
      nameText: this.scene.add.text(0, 0, this.text ?? '', { fontSize: '20px' }),

      // @ts-ignore
      valueText: this.scene.rexUI.add.BBCodeText(0, 0, '', { fontSize: '20px' }),


      valueTextFormatCallback: (value, min, max) => {
        value = Math.floor(value)
        let displayValue
        if (value <= max * 0.3) {
          displayValue = `[color=red][b]${value}[/b][/color]`
        } else {
          displayValue = `[b]${value}[/b]`
        }
        console.log(`display: '${displayValue}`)
        return `${displayValue}/${max}`
      },

      bar: {
        valuechangeCallback: () => {
        },
        height: 6,
        barColor: 0xd3b8ae,
        barColor2: 0x321911,
        // trackColor: COLOR_DARK,
        // trackStrokeColor: COLOR_LIGHT
      },

      align: {},

      space: {
        left: 20, right: 20, top: 20, bottom: 20,
        icon: 10,
        // @ts-ignore
        bar: -6
      },

    })
      .layout()

    let min = 0, max = 100, value = min
    label0.setValue(value, min, max)
    this.scene.input.on('pointerdown', function() {
      value = Phaser.Math.Clamp(value + 5, min, max)
      label0.setValue(value, min, max)
    })

    // this.scene.add.text(0, 580, 'Any click')
  }

}