import { PotatoScene } from '../../common/PotatoScene'
import { AbstractUIBuilder } from '../AbstractUIBuilder'
import Container = Phaser.GameObjects.Container
import { DRAG_EVENTS } from '../DragBuilder'

/**
 * Used for displaying a single-colour rectangular
 */
export class RectangularBuilder extends AbstractUIBuilder {
  private text?: string

  private baseColour: number
  private dragHoverColour: number
  private hoverColour: number

  private alpha: number

  constructor(scene: PotatoScene) {
    super(scene)

    this.width = 20
    this.height = 20

    // Gray color
    this.alpha = 1.0
    this.baseColour = 0xD3D3D3

    // Red color
    this.hoverColour = 0xff0000

    this.dragHoverColour = this.hoverColour
  }

  public setBaseColour(colour: number) {
    this.baseColour = colour
    return this
  }

  build() {
    return this.addRectangular()
  }

  private addRectangular() {
    const graphics = this.scene.add.graphics();

    // Set the fill style for the rectangle
    graphics.fillStyle(this.baseColour, this.alpha);

    // Set the line style for the border (red color, 5 pixels thick)
    graphics.lineStyle(10, this.baseColour, this.alpha); // Red color, fully opaque, 5 pixels thick

    // Draw the filled rectangle
    graphics.fillRect(this.position.x, this.position.y, this.width, this.height);

    // Draw the rectangle border using the same coordinates and dimensions
    graphics.strokeRect(this.position.x, this.position.y, this.width, this.height);

    graphics.addListener(DRAG_EVENTS.ENTER_HOVER, (draggedItem: unknown) => {
      graphics.fillStyle(this.hoverColour, this.alpha);
      //graphics.fillRect(this.position.x, this.position.y, this.width, this.height);
    })

    graphics.addListener(DRAG_EVENTS.LEAVE_HOVER, (draggedItem: unknown) => {
      graphics.fillStyle(this.baseColour, this.alpha);
      //graphics.fillRect(this.position.x, this.position.y, this.width, this.height);
    })

    return graphics

    // ToDo future optimization
    // this.texture = this.graphics.generateTexture()
  }

  static instance(scene: PotatoScene) {
    return new RectangularBuilder(scene)
  }
}
