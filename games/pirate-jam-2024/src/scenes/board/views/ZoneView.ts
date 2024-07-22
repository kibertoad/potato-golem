import type { Position, PotatoScene } from '@potato-golem/ui'
import Phaser from 'phaser'

export type ZoneViewParams = {
  scene: PotatoScene
  id: string
  name: string
  vertices: Position[]
  debug?: boolean
  debugColor?: number
}

export class ZoneView {
  public readonly zone: Phaser.GameObjects.Zone

  private readonly debugGraphics?: Phaser.GameObjects.Graphics

  constructor(params: ZoneViewParams, pointerOverCallback?: (pointedZoneView: ZoneView) => void) {
    // Create a Polygon
    const polygon = new Phaser.Geom.Polygon(params.vertices)

    if (params.debug) {
      // Draw the Polygon
      console.log('Drawing debug polygon')
      const color = params.debugColor || Phaser.Display.Color.GetColor(255, 0, 0)
      this.debugGraphics = params.scene.add.graphics()
      this.debugGraphics.lineStyle(0, color)
      this.debugGraphics.fillStyle(color, 0.3)
      this.debugGraphics.fillPoints(polygon.points, true)
      this.debugGraphics.strokePoints(polygon.points, true)
      this.debugGraphics.depth = 51
      this.debugGraphics.visible = false
    }

    const vertices = params.vertices
    // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
    let minX = vertices[0].x,
      minY = vertices[0].y,
      maxX = vertices[0].x,
      maxY = vertices[0].y
    for (const point of vertices) {
      if (point.x < minX) minX = point.x
      if (point.x > maxX) maxX = point.x
      if (point.y < minY) minY = point.y
      if (point.y > maxY) maxY = point.y
    }
    const width = maxX - minX
    const height = maxY - minY

    // Create a Zone using the Polygon
    const zone = params.scene.add
      .zone(0, 0, width, height)
      .setInteractive(polygon, Phaser.Geom.Polygon.Contains)

    // Set Zone properties for drag and drop
    zone.setOrigin(0, 0)
    zone.input.dropZone = true

    zone.on('pointerover', () => {
      console.log(params.id, 'zone was dragger over')
      if (pointerOverCallback) {
        pointerOverCallback(this)
      }
    })

    this.zone = zone
  }

  public highlight() {
    if (this.debugGraphics) {
      this.debugGraphics.visible = true
    }
  }

  public unhighlight() {
    if (this.debugGraphics) {
      this.debugGraphics.visible = false
    }
  }
}
