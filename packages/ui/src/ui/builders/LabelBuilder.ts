import { ActivationCallback } from '../activations/ActivationTypes'
import { AbstractUIBuilder } from './AbstractUIBuilder'

export class LabelBuilder extends AbstractUIBuilder {
  private fillColour?: number
  private text?: string
  private activation?: ActivationCallback

  public setFillColour(value: number) {
    this.fillColour = value
    return this
  }

  public setText(value: string) {
    this.text = value
    return this
  }

  public setActivation(value?: ActivationCallback) {
    this.activation = value
  }

  build() {
    const name = this.text
    const label = this.scene.rexUI.add.label({
      background: this.scene.rexUI.add.roundRectangle(
        0,
        0,
        this.getWidth(),
        this.getHeight(),
        20,
        this.fillColour ?? 0x6a4f4b,
      ),

      text: this.scene.add.text(0, 0, this.text ?? 'MISSING_VALUE', {
        fontSize: '24px',
      }),

      space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },

      name: name,
    })

    if (this.activation) {
      label.on('click', this.activation)
    }

    return label
  }
}
