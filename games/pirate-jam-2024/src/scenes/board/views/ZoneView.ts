import type { Destroyable, EventSink, IdHolder } from '@potato-golem/core'
import type { Position, PotatoScene } from '@potato-golem/ui'
import Phaser from 'phaser'
import type { CardId } from '../../../model/registries/cardRegistry'
import { DepthRegistry } from '../../../model/registries/depthRegistry'
import type { Zone } from '../../../model/registries/zoneRegistry'
import type { BoardSupportedEvents } from '../BoardScene'
import { CardView } from './CardView'

export type FindCardResult = {
  card?: CardView
  spawnPoint?: CardView[]
}
export type ZoneViewParams = {
  scene: PotatoScene
  id: Zone
  name: string
  vertices: Position[]
  spawnPoints: Position[]
  stackDirection: StackDirection
  debug?: boolean
  debugColor?: number
  cardStartingSpawnPoint?: number //Card spawn point index which will be used as a starting point for stacking cards
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

  private readonly cardStartingSpawnPoint?: number

  constructor(params: ZoneViewParams, dependencies: ZoneDependencies) {
    this.id = params.id
    this.boardEventSink = dependencies.boardEventSink
    this.cardStartingSpawnPoint = params.cardStartingSpawnPoint

    // Create a Polygon
    const polygon = new Phaser.Geom.Polygon(params.vertices)
    this.spawnPoints = params.spawnPoints
    this.stackDirection = params.stackDirection

    for (const _spawnPoint of this.spawnPoints) {
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
      //console.log(params.id, 'zone was hovered over')
      this.boardEventSink.emit('ZONE_HOVERED_OVER', this)
    })

    this.zone = zone
  }

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
  public findEmptySpawnPointOnTheSides(cardToStack?: CardView): number {
    const startingPoint = this.cardStartingSpawnPoint ?? Math.floor(this.spawnPoints.length / 2)
    const iterations = this.spawnPoints.length - startingPoint - 1

    const stackedCardType = cardToStack.model.definition.id
    if (cardToStack) {
      for (let i = 0; i < this.spawnPoints.length; i++) {
        if (this.spawnPointCards[i].length === 0) {
          continue
        }
        if (this.spawnPointCards[i][0].model.definition.id === stackedCardType) {
          return i
        }
      }
    }

    if (this.spawnPointCards[startingPoint].length === 0) {
      return startingPoint
    }

    for (let i = 1; i <= iterations; i++) {
      const left = startingPoint - i
      const right = startingPoint + i

      if (left >= 0 && this.spawnPointCards[left].length === 0) {
        return left
      }

      if (right < this.spawnPoints.length && this.spawnPointCards[right].length === 0) {
        return right
      }
    }

    return 0
  }

  public findAvailableSpawnPoint(cardView: CardView): { x: number; y: number; index: number } {
    //pick random spawn point from zone
    const index = this.findEmptySpawnPointOnTheSides(cardView)
    const spawnPoint = this.spawnPoints[index]
    const result: { x: number; y: number; index: number } = { x: 0, y: 0, index: index }

    switch (this.stackDirection) {
      case 'up':
        result.y = this.spawnPointCards[index].length * -StackSpacing
        break
      case 'down':
        result.y = this.spawnPointCards[index].length * StackSpacing
        break
      case 'left':
        result.x = this.spawnPointCards[index].length * -StackSpacing
        break
      case 'right':
        result.x = this.spawnPointCards[index].length * StackSpacing
        break
    }

    result.x += spawnPoint.x
    result.y += spawnPoint.y

    return result
  }

  public addCard(cardView: CardView): void {
    const spawnPoint = this.findAvailableSpawnPoint(cardView)

    this.registerCard(cardView, spawnPoint.index)

    cardView.x = spawnPoint.x
    cardView.y = spawnPoint.y
  }

  public registerCard(cardView: CardView, spawnIndex: number): void {
    this.spawnPointCards[spawnIndex].push(cardView)
  }

  public reorderStackedCardDepths() {
    for (const spawnPoint of this.spawnPointCards) {
      let counter = 0
      for (const card of spawnPoint) {
        card.setDepth(DepthRegistry.CARD_MIN + counter++)
      }
    }
  }

  public findCardByID(cardId: CardId): FindCardResult {
    // console.log(`Searching for ${cardId} in ${this.id}`)
    // const currentCards = this.spawnPointCards.map((entry) => entry.map((card) => card.model.definition.id).join('; '))
    // console.log(`Current cards: ${currentCards.join(', ')}`)

    for (const spawnPoint of this.spawnPointCards) {
      const card = spawnPoint.find((card) => card.model.definition.id === cardId)
      if (card) {
        return {
          spawnPoint,
          card,
        }
      }
    }
    return {
      spawnPoint: undefined,
      card: undefined,
    }
  }

  public hasCard(cardId: CardId) {
    const { card } = this.findCardByID(cardId)
    return card !== undefined
  }

  public findCardByUUID(cardUUID: string): FindCardResult {
    for (const spawnPoint of this.spawnPointCards) {
      const card = spawnPoint.find((card) => card.model.id === cardUUID)
      if (card) {
        return {
          spawnPoint,
          card,
        }
      }
      return {
        spawnPoint: undefined,
        card: undefined,
      }
    }
  }

  public removeCardByUUID(cardUUID: string): void {
    for (const spawnPoint of this.spawnPointCards) {
      const cardIndex = spawnPoint.findIndex((card) => card.model.id === cardUUID)
      if (cardIndex !== -1) {
        spawnPoint.splice(cardIndex, 1)
        this.reorderStackedCardDepths()
        return
      }
    }
  }

  public removeCardByID(cardId: CardId): void {
    for (const spawnPoint of this.spawnPointCards) {
      const cardIndex = spawnPoint.findIndex((card) => card.model.definition.id === cardId)
      if (cardIndex !== -1) {
        spawnPoint.splice(cardIndex, 1)
        this.reorderStackedCardDepths()
        return
      }
    }
    console.log(`Card ${cardId} was not found`)
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
