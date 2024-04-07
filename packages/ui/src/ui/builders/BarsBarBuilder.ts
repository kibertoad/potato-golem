import { PotatoScene } from '../common/PotatoScene'
import { AbstractUIBuilder } from './AbstractUIBuilder'
import { LimitedNumber } from '@potato-golem/core'
import Container = Phaser.GameObjects.Container

export class BarsBarBuilder extends AbstractUIBuilder {
  private text?: string
  private offsetX: number
  private offsetY: number
  private emptyColour: number
  private fullColour: number
  private alpha: number
  private borderWidth: number
  private readonly value: LimitedNumber
  //private readonly graphics: Phaser.GameObjects.Graphics

  constructor(scene: PotatoScene) {
    super(scene)

    this.value = new LimitedNumber(0, 0)
    this.offsetX = 0
    this.offsetY = 0
    this.width = 20
    this.height = 20

    // Red color, fully opaque
    this.alpha = 1.0
    this.fullColour = 0xff0000

    // Black color, fully opaque
    this.emptyColour = 0x000000
    this.borderWidth = 5
  }

  public setMaxValue(maxValue: number) {
    this.value.maxValue = maxValue
    return this
  }

  public setBorderWidth(value: number) {
    this.borderWidth = value
    return this
  }

  public setValue(value: number) {
    this.value.setValue(value)
    return this
  }

  public setOffsetX(value: number) {
    this.offsetX = value
    return this
  }

  public setOffsetY(value: number) {
    this.offsetY = value
    return this
  }

  build() {
    const container = new Container(this.scene)

    let counter = 0
    for (; counter < this.value.value; counter++) {
      this.addFilledBar(counter, container)
    }
    for (; counter < this.value.maxValue; counter++) {
      this.addEmptyBar(counter, container)
    }

    return container
  }

  private addEmptyBar(count: number, container: Container) {
    const graphics = this.scene.add.graphics();

    const x = this.offsetX ? this.position.x + (count * (this.offsetX + this.width + this.borderWidth * 2)) : this.position.x
    const y = this.offsetY ? this.position.y + (count * (this.offsetY + this.height + this.borderWidth * 2)) : this.position.y

    // Set the fill style for the rectangle (black color)
    graphics.fillStyle(this.emptyColour, this.alpha); // Black color, fully opaque

    // Set the line style for the border (red color, 5 pixels thick)
    graphics.lineStyle(this.borderWidth, this.fullColour, this.alpha); // Red color, fully opaque, 5 pixels thick

    // Draw the filled rectangle (x, y, width, height)
    graphics.fillRect(x, y, this.width, this.height);

    // Draw the rectangle border using the same coordinates and dimensions
    graphics.strokeRect(x, y, this.width, this.height);

    container.add(graphics)

    // ToDo future optimization
    // this.texture = this.graphics.generateTexture()
  }

  private addFilledBar(count: number, container: Container) {
    const graphics = this.scene.add.graphics();

    const x = this.offsetX ? this.position.x + (count * (this.offsetX + this.width + this.borderWidth * 2)) : this.position.x
    const y = this.offsetY ? this.position.y + (count * (this.offsetY + this.height + this.borderWidth * 2)) : this.position.y

    // Set the fill style for the rectangle (black color)
    graphics.fillStyle(this.fullColour, this.alpha); // Black color, fully opaque

    // Set the line style for the border (red color, 5 pixels thick)
    graphics.lineStyle(this.borderWidth, this.fullColour, this.alpha); // Red color, fully opaque, 5 pixels thick

    // Draw the filled rectangle (x, y, width, height)
    graphics.fillRect(x, y, this.width, this.height);

    // Draw the rectangle border using the same coordinates and dimensions
    graphics.strokeRect(x, y, this.width, this.height);

    container.add(graphics)

    // ToDo future optimization
    // this.texture = this.graphics.generateTexture()
  }

  static instance(scene: PotatoScene) {
    return new BarsBarBuilder(scene)
  }
}
