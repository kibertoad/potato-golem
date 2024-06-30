import Container = Phaser.GameObjects.Container
import {
  BarsBarBuilder,
  buildDrag, buildDragWithActivations,
  Position,
  PotatoScene, RectangularGraphicsContainer,
  restoreStartPosition,
  setEntityModel,
  setEntityType,
  SpriteBuilder, TextBuilder,
} from '@potato-golem/ui'
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import { TicketModel, TicketStatus } from '../model/entities/TicketModel'
import { canTransition } from '../model/stateMachines/ticketStateMachine'
import Graphics = Phaser.GameObjects.Graphics

export type TicketViewParams = {
  ticketModel: TicketModel
} & Position

const textOffsetX = 5
const textOffsetY = 5

export type TicketViewDependencies = {
  swimlanes: RectangularGraphicsContainer[]
}

export class TicketView extends Container {
  private readonly ticketSprite: Phaser.GameObjects.Sprite
  private readonly ticketModel: TicketModel
  private readonly ticketTitle: Phaser.GameObjects.Text

  constructor(
    scene: PotatoScene,
    params: TicketViewParams,
    dependencies: TicketViewDependencies
  ) {
    super(scene)

    this.ticketModel = params.ticketModel
    this.ticketTitle = TextBuilder.instance(scene)
      .setPosition({
        x: params.x + textOffsetX,
        y: params.y + textOffsetY,
      })
      .setText(params.ticketModel.params.name)
      .setDisplaySize(15,15)
      .build()
      .value

    const ticketBackgroundWidth = 200
    const ticketBackgroundHeight = 100

    this.ticketSprite = SpriteBuilder.instance(scene)
      .setTextureKey('glass-panel')
      .setPosition({
        x: params.x,
        y: params.y,
      })
      .setWidth(ticketBackgroundWidth)
      .setHeight(ticketBackgroundHeight)
      .build()

    const barsContainer = BarsBarBuilder.instance(scene)
      .setRelativePositionFromSprite(
        this.ticketSprite,
        20,
        80
      )
      .setWidth(8)
      .setHeight(14)
      .setOffsetX(4)
      .setMaxValue(10)
      .setValue(2)
      .setBorderWidth(2)
      .build()

    this.add(barsContainer)
    // this.scene.add.existing(barsContainer)

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
        [EntityTypeRegistry.SWIMLANE]: (pointer) => {
          const swimlaneSize = 1024 / 5
          const swimLane = Math.ceil(pointer.x / swimlaneSize)
          console.log(`Swimlane ${swimLane}`)

          const newStatus = Object.values(TicketStatus)[swimLane - 1]

          const ticketCanTransition = canTransition(this.ticketModel, newStatus)

          console.log(`Can transition: ${ticketCanTransition}`)

          if (!ticketCanTransition) {
            restoreStartPosition(this)
          } else {
            this.ticketModel.status = newStatus
          }
        },
      },
      config: {},
      potentialHoverTargets: [
        ...dependencies.swimlanes.map((entry) => entry.rectangle)
      ],
      potentialDropTargets: [],
    })
  }
}
