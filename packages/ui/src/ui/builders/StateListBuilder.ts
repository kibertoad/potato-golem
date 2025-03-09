import { LimitedNumber } from '@potato-golem/core'
import Container = Phaser.GameObjects.Container
import { validateNumber } from 'validation-utils'
import { Scene } from 'phaser'

export type StateListBuilderParamEntry = {
  labelText: string
  value: LimitedNumber
  progressValue?: LimitedNumber // if not set, do not display the progress bar
}

export type StateListBuilderParam = {
  offsetX?: number
  offsetY?: number
  startTextX: number
  startTextY: number
}


/**
 * Used for displaying a state icon, a progress bar, a numeric value and a name in a vertical list
 */
export class StateListBuilder {

  private readonly entries: StateListBuilderParamEntry[]
  private readonly scene: Scene
  private offsetX?: number
  private offsetY?: number
  private startTextX: number
  private startTextY: number

  constructor(scene: Scene, params: StateListBuilderParam) {
    this.scene = scene
    this.entries = []
    this.offsetX = params.offsetX
    this.offsetY = params.offsetY
    this.startTextX = params.startTextX
    this.startTextY = params.startTextY
  }

  add(param: StateListBuilderParamEntry) {
    this.entries.push(param)
    return this
  }

  build() {
    const container = new Container(this.scene)

    for (let count = 0; count < this.entries.length; count++) {
      const entry = this.entries[count]

      // depending on whether this is vertical or horizontal line, one or the other offset will be set
      const x = this.offsetX
        ? this.startTextX + count * (this.offsetX)
        : this.startTextX
      const y = this.offsetY
        ? this.startTextY + count * (this.offsetY)
        : this.startTextY

      /*
      const textLabel = this.scene.add
        .text(validateNumber(x), validateNumber(y), `${entry.labelText} ${entry.value.value}`)
        .setOrigin(0.5, 0.5)

       */

      const labelText = this.scene.add.text(x, y, entry.labelText, {
        fontSize: '20px',
        color: '#FFFFFF' // White color for labelText
      }).setOrigin(0.5, 0.5);

      const valueText = this.scene.add.text((labelText.x + labelText.width / 2) + 20, y, entry.value.value.toString(), {
        fontSize: '20px',
        color: '#FF0000' // Red color for value
      }).setOrigin(0, 0.5);

      container.add(labelText)
      container.add(valueText)
    }

    return container
  }

  static instance(scene: Scene, params: StateListBuilderParam) {
    return new StateListBuilder(scene, params)
  }
}
