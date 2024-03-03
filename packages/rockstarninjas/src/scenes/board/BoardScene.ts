import {
  ButtonListBuilder1,
  SpriteBuilder,
  buildDrag,
  buildOnHover,
  restoreStartPosition,
  setEntityModel,
  setEntityType,
} from '@potato-golem/ui'
import { buildDragWithActivations } from '@potato-golem/ui/dist/src/ui/builders/DragBuilder'
import { PotatoScene } from '@potato-golem/ui/dist/src/ui/common/PotatoScene'
import { AssignEngineerActivation } from './activations/AssignEngineerActivation'
import Sprite = Phaser.GameObjects.Sprite
import { Scenes } from '../../model/registries/SceneRegistry'
import { WorldModel, worldModel } from '../../model/state/worldModel'
import { TicketModel, TicketStatus } from './model/entities/TicketModel'
import { EntityTypeRegistry } from '../../model/registries/entityTypeRegistry'
import { canTransition } from './model/stateMachines/ticketStateMachine'
import { DeveloperEmployee } from '../../model/entities/DeveloperEmployee'
import { ProcessorActivation } from '@potato-golem/core'
import { NextTurnProcessor } from './model/processors/NextTurnProcessor'
import { Dependencies } from '../../model/diConfig'

export class BoardScene extends PotatoScene {
  private readonly nextTurnActivation: ProcessorActivation<NextTurnProcessor>
  private readonly worldModel: WorldModel

  private readonly ticketViews: Sprite[]
  private readonly engineerViews: Sprite[]

  constructor({ nextTurnProcessor }: Dependencies) {
    super(Scenes.BOARD_SCENE)

    this.worldModel = worldModel
    this.nextTurnActivation = new ProcessorActivation<NextTurnProcessor>(nextTurnProcessor)
    this.ticketViews = []
    this.engineerViews = []
  }

  addTicketView(ticketModel: TicketModel) {
    const dragImage = SpriteBuilder.instance(this)
      .setTextureKey('glass-panel')
      .setPosition({
        x: 15,
        y: 15,
      })
      .setWidth(100)
      .setHeight(100)
      .build()

    setEntityType(dragImage, EntityTypeRegistry.TICKET)
    setEntityModel(dragImage, ticketModel)

    buildDrag(
      dragImage,
      (pointer) => {
        const swimlaneSize = 1024 / 5
        const swimLane = Math.ceil(pointer.x / swimlaneSize)
        console.log(`Swimlane ${swimLane}`)

        const newStatus = Object.values(TicketStatus)[swimLane - 1]

        const ticketCanTransition = canTransition(ticketModel, newStatus)

        console.log(`Can transition: ${ticketCanTransition}`)

        if (!ticketCanTransition) {
          restoreStartPosition(dragImage)
        } else {
          ticketModel.status = newStatus
        }
      },
      {},
    )

    return dragImage
  }

  addTicket() {
    const ticket = new TicketModel()
    this.worldModel.tickets.push(ticket)

    const ticketView = this.addTicketView(ticket)
    this.ticketViews.push(ticketView)
  }

  addDeveloper() {
    const developerModel = new DeveloperEmployee()

    this.worldModel.teamModel.developers.push(developerModel)

    const engineerImage = SpriteBuilder.instance(this)
      .setTextureKey('logo')
      .setPosition({
        x: 250,
        y: 200,
      })
      .setWidth(100)
      .setHeight(100)
      .build()

    setEntityType(engineerImage, EntityTypeRegistry.ENGINEER)
    setEntityModel(engineerImage, developerModel)

    buildOnHover(
      engineerImage,
      () => {
        console.log('hovered')
      },
      () => {
        console.log('unhovered')
      },
      {},
    )

    buildDragWithActivations(
      engineerImage,
      this.ticketViews,
      {
        [EntityTypeRegistry.DEFAULT]: () => {
          console.log('Revert to original position')
          restoreStartPosition(engineerImage)
        },
        [EntityTypeRegistry.TICKET]: new AssignEngineerActivation(developerModel),
      },
      {
        tolerance: 250,
      },
    )

    this.engineerViews.push(engineerImage)
  }

  init() {
    this.addTicket()
    this.addDeveloper()

    /*
    const ticket = this.add.rectangle(500, 500, 80, 80)
      .setFillStyle(0xa98270, 1)
      .setStrokeStyle(2, 0xa98274)
      .setDepth(10)
      .setData(ENTITY_TYPE_DATA_KEY, 'ticket')

     */
  }

  preload() {}

  create() {
    const { width, height } = this.scale
    const buttonList = new ButtonListBuilder1(this)
      .textureKey('violet')
      .displaySize(150, 50)
      .setExactPosition(width * 0.5, height * 0.6)
      .setSpacingOffset(0, 10)

    const nextDayButton = buttonList
      .addButton()
      .text('Confirm')
      .onClick(this.nextTurnActivation)
      .build()
  }
}
