import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import {
  type AbstractUIElementLite,
  BarsBarBuilder,
  type Position,
  type PotatoScene,
  type RectangularGraphicsContainer,
  SpriteBuilder,
  TextBuilder,
  buildDragWithActivations,
  restoreStartPosition,
  setEntityModel,
  addGlobalTracker,
  setEntityType, getEntityModel,
} from '@potato-golem/ui'
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import type { SwimlaneModel } from '../model/entities/SwimlaneModel'
import type { TicketModel } from '../model/entities/TicketModel'
import { canTransition } from '../model/stateMachines/ticketStateMachine'

export type TicketViewParams = {
  ticketModel: TicketModel
} & Position

const textOffsetX = 35
const textOffsetY = 5

export type TicketViewDependencies = {
  swimlanes: RectangularGraphicsContainer[]
}

export class TicketImageView extends Container {

  /**
   * Static image background for the ticket
   */
  private readonly ticketSprite: Phaser.GameObjects.Sprite

  /**
   * Text element with the name of the ticket
   */
  private readonly ticketTitle: Phaser.GameObjects.Text

  /**
   * Domain model of the ticket
   */
  private readonly ticketModel: TicketModel

  /**
   * Container for the ticket completion bars
   */
  private readonly barsContainer: Container

  constructor(scene: PotatoScene, params: TicketViewParams, dependencies: TicketViewDependencies) {
    super(scene)

    this.x = params.x
    this.y = params.y

    this.ticketModel = params.ticketModel

    this.ticketSprite = SpriteBuilder.instance(scene)
      .setTextureKey('glass-panel')
      .setPosition({
        // x: params.x,
        // y: params.y,

        x: 0,
        y: 0,
      })
      .setOrigin(0, 0)
      .setWidth(200)
      .setHeight(100)
      .build()

    addGlobalTracker(() => `SpriteX:${this.ticketSprite.x};SpriteY:${this.ticketSprite.y}`)
    addGlobalTracker(() => `SpriteWidth:${this.ticketSprite.width};SpriteHeight:${this.ticketSprite.height}`)
    addGlobalTracker(() => `SpriteOriginX:${this.ticketSprite.originX};SpriteOriginY:${this.ticketSprite.originY}`)
    addGlobalTracker(() => `ContainerX:${this.x};ContainerY:${this.y}`)
    addGlobalTracker(() => `ContainerWidth:${this.width};ContainerHeight:${this.height}`)

    this.ticketTitle = TextBuilder.instance(scene)
      .setRelativePositionFromBackground(this,
        textOffsetX,
        textOffsetY
        )
      .setOrigin(0, 0)
      .setText(params.ticketModel.params.name)
      .setDisplaySize(15, 15)
      .build().value

    const barsContainer = BarsBarBuilder.instance(scene)
      .setRelativePositionFromSprite(this, 20, 80)
      .setWidth(8)
      .setHeight(14)
      .setOffsetX(4)
      .setMaxValue(10)
      .setValue(2)
      .setBorderWidth(2)
      .build()

    this.add(barsContainer)
    this.barsContainer = barsContainer

    setEntityType(this.ticketSprite, EntityTypeRegistry.TICKET)
    setEntityModel(this.ticketSprite, this.ticketModel)

    this.add(this.ticketSprite)
    this.add(this.ticketTitle)

    scene.add.existing(this)

    // Build ticket drag'n'drop
    buildDragWithActivations({
      dragStartItem: this.ticketSprite,
      draggedItem: this,
      dropActivations: {
        [EntityTypeRegistry.DEFAULT]: () => {
          restoreStartPosition(this)
        },
        [EntityTypeRegistry.SWIMLANE]: (swimlaneZone: AbstractUIElementLite) => {
          const swimLane = getEntityModel<SwimlaneModel>(swimlaneZone)
          console.log(`Swimlane ${swimLane.label}`)

          const newStatus = swimLane.ticketStatus

          const ticketCanTransition = canTransition(this.ticketModel, newStatus)

          console.log(`Can transition: ${ticketCanTransition}`)

          if (!ticketCanTransition) {
            restoreStartPosition(this)
          } else {
            // copyCoords(this, this.ticketSprite)
            this.ticketModel.status = newStatus
          }
        },
      },
      config: {},
      potentialHoverTargets: [...dependencies.swimlanes.map((entry) => entry.zone)],
      potentialDropTargets: [...dependencies.swimlanes.map((entry) => entry.zone)],
    })
  }
}
