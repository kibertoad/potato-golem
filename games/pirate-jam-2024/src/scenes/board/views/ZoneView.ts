import type { Destroyable, EventSink, IdHolder } from '@potato-golem/core'
import type { Position, PotatoScene } from '@potato-golem/ui'
import Phaser from 'phaser'
import { DepthRegistry } from '../../../model/registries/depthRegistry'
import type { Zone } from '../../../model/registries/zoneRegistry'
import type { BoardSupportedEvents } from '../BoardScene'
import { CardView } from './CardView'

export type ZoneViewParams = {
  scene: PotatoScene
  id: Zone
  name: string
  vertices: Position[]
  spawnPoints: Position[]
  stackDirection: StackDirection
  debug?: boolean
  debugColor?: number
}

export type ZoneDependencies = {
  boardEventSink: EventSink<BoardSupportedEvents>
}

export type StackDirection = 'up' | 'down' | 'left' | 'right'

export const StackSpacing: number = 20

export class ZoneView implements IdHolder, Destroyable {
  id: Zone
  public readonly zone: Phaser.GameObjects.Zone
  public spawnPoints: Position[] = []

  private readonly debugGraphics?: Phaser.GameObjects.Graphics
  private readonly debugGraphicsSpawns?: Phaser.GameObjects.Graphics
  private readonly boardEventSink: EventSink<BoardSupportedEvents>

  private readonly spawnPointCards: Array<CardView[]> = []

  private readonly stackDirection: StackDirection

  constructor(params: ZoneViewParams, dependencies: ZoneDependencies) {
    this.id = params.id
    this.boardEventSink = dependencies.boardEventSink

    // Create a Polygon
    const polygon = new Phaser.Geom.Polygon(params.vertices)
    this.spawnPoints = params.spawnPoints
    this.stackDirection = params.stackDirection

    for (const spawnPoint of this.spawnPoints) {
      this.spawnPointCards.push([])
    }

    if (params.debug) {
      // Draw the Polygon
      console.log('Drawing debug polygon')
      const color = params.debugColor || Phaser.Display.Color.GetColor(255, 0, 0)
      this.debugGraphics = params.scene.add.graphics()
      this.debugGraphics.lineStyle(0, color)
      this.debugGraphics.fillStyle(color, 0.2)
      this.debugGraphics.fillPoints(polygon.points, true)
      this.debugGraphics.strokePoints(polygon.points, true)
      this.debugGraphics.depth = DepthRegistry.ZONE_HIGHLIGHT
      this.debugGraphics.visible = false
    }

    if (params.debug) {
      const cardHalfWidth = CardView.cardWidth / 2
      const cardHalfHeight = CardView.cardHeight / 2

      for (const i in this.spawnPoints) {
        const spawnPoint = this.spawnPoints[i]
        const color = params.debugColor || Phaser.Display.Color.GetColor(255, 0, 0)

        this.debugGraphicsSpawns = params.scene.add.graphics()
        this.debugGraphicsSpawns.lineStyle(0, color)
        this.debugGraphicsSpawns.fillStyle(color, 0.5)
        this.debugGraphicsSpawns.strokeRect(
          spawnPoint.x - cardHalfWidth,
          spawnPoint.y - cardHalfHeight,
          CardView.cardWidth,
          CardView.cardHeight,
        )
        this.debugGraphicsSpawns.fillRect(
          spawnPoint.x - cardHalfWidth,
          spawnPoint.y - cardHalfHeight,
          CardView.cardWidth,
          CardView.cardHeight,
        )
        this.debugGraphicsSpawns.depth = DepthRegistry.ZONE_HIGHLIGHT + 100
        this.debugGraphicsSpawns.visible = false
      }
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
      console.log(params.id, 'zone was hovered over')
      this.boardEventSink.emit('ZONE_HOVERED_OVER', this)
    })

    this.zone = zone
  }

  public findEmptySpawnPointFromMiddle(cardToStack?: CardView): number {
    const middle = Math.floor(this.spawnPoints.length / 2)

    const stackedCardType = cardToStack.model.definition.id
    if (
      this.spawnPointCards[middle].length === 0 ||
      (cardToStack && this.spawnPointCards[middle][0].model.definition.id === stackedCardType)
    ) {
      return middle
    }

    for (let i = 1; i <= middle; i++) {
      const left = middle - i
      const right = middle + i

      if (
        left >= 0 &&
        (this.spawnPointCards[left].length === 0 ||
          (cardToStack && this.spawnPointCards[left][0].model.definition.id === stackedCardType))
      ) {
        return left
      }

      if (
        right < this.spawnPoints.length &&
        (this.spawnPointCards[right].length === 0 ||
          (cardToStack && this.spawnPointCards[right][0].model.definition.id === stackedCardType))
      ) {
        return right
      }
    }

    return 0
  }

  public addCard(cardView: CardView) {
    //pick random spawn point from zone
    const spawnPointIndex = this.findEmptySpawnPointFromMiddle(cardView)
    const spawnPoint = this.spawnPoints[spawnPointIndex]

    switch (this.stackDirection) {
      case 'up':
        cardView.y = this.spawnPointCards[spawnPointIndex].length * -StackSpacing
        break
      case 'down':
        cardView.y = this.spawnPointCards[spawnPointIndex].length * StackSpacing
        break
      case 'left':
        cardView.x = this.spawnPointCards[spawnPointIndex].length * -StackSpacing
        break
      case 'right':
        cardView.x = this.spawnPointCards[spawnPointIndex].length * StackSpacing
        break
    }

    cardView.x += spawnPoint.x
    cardView.y += spawnPoint.y

    this.spawnPointCards[spawnPointIndex].push(cardView)
  }

  public reorderStackedCardDepths() {
    for (const spawnPoint of this.spawnPointCards) {
      let counter = 0
      for (const card of spawnPoint) {
        card.setDepth(DepthRegistry.CARD_MIN + counter++)
      }
    }
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

  destroy(): void {
    this.zone.destroy()
  }
}
