import {
  ButtonListBuilder1,
  SpriteBuilder,
  buildDrag,
  buildOnHover,
  restoreStartPosition,
  setEntityModel,
  setEntityType,
  PotatoScene
} from '@potato-golem/ui'
import { buildDragWithActivations } from '@potato-golem/ui/dist/src/ui/builders/DragBuilder'
import { AssignEngineerActivation } from './activations/AssignEngineerActivation'
import Sprite = Phaser.GameObjects.Sprite
import { ProcessorActivation } from '@potato-golem/core'
import { Dependencies } from '../../model/diConfig'
import { DeveloperEmployee } from '../../model/entities/DeveloperEmployee'
import { Scenes } from '../../model/registries/SceneRegistry'
import { EntityTypeRegistry } from '../../model/registries/entityTypeRegistry'
import { WorldModel } from '../../model/state/worldModel'
import { TicketModel, TicketStatus } from './model/entities/TicketModel'
import { NextTurnProcessor } from './model/processors/NextTurnProcessor'
import { canTransition } from './model/stateMachines/ticketStateMachine'
import { AnalystEmployee } from '../../model/entities/AnalystEmployee'
import { QaEmployee } from '../../model/entities/QaEmployee'
import { BoardView } from './views/BoardView'
import { TicketView } from './views/TicketView'

export class BoardScene extends PotatoScene {
  private readonly nextTurnActivation: ProcessorActivation<NextTurnProcessor>
  private readonly worldModel: WorldModel

  private readonly ticketViews: TicketView[]
  private readonly engineerViews: Sprite[]

  constructor({ nextTurnProcessor, worldModel }: Dependencies) {
    super(Scenes.BOARD_SCENE)

    this.worldModel = worldModel
    this.nextTurnActivation = new ProcessorActivation<NextTurnProcessor>(nextTurnProcessor)
    this.ticketViews = []
    this.engineerViews = []
  }

  init() {
    this.addBoardView()
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

  addBoardView() {
    this.viewParents.push(new BoardView(this))
  }

  addTicket() {
    const ticket = new TicketModel({
      name: 'Login',
      complexity: 5,
    })
    this.worldModel.addTicket(ticket)

    const ticketView = new TicketView(this, {
      ticketModel: ticket,
      x: 15,
      y: 15
    })
    this.ticketViews.push(ticketView)
  }

  addEmployee(employeeModel) {
    this.worldModel.addEmployee(employeeModel)

    const employeeImage = SpriteBuilder.instance(this)
      .setTextureKey('logo')
      .setPosition({
        x: 250,
        y: 200,
      })
      .setWidth(100)
      .setHeight(100)
      .build()

    setEntityType(employeeImage, EntityTypeRegistry.ENGINEER)
    setEntityModel(employeeImage, employeeModel)

    buildOnHover(
      employeeImage,
      () => {
        console.log(`hovered (${employeeModel.area})`)
      },
      () => {
        console.log('unhovered')
      },
      {},
    )

    buildDragWithActivations(
      employeeImage,
      employeeImage,
      this.ticketViews,
      {
        [EntityTypeRegistry.DEFAULT]: () => {
          console.log('Revert to original position')
          restoreStartPosition(employeeImage)
        },
        [EntityTypeRegistry.TICKET]: new AssignEngineerActivation(employeeModel),
      },
      {
        tolerance: 250,
      },
    )

    this.engineerViews.push(employeeImage)
  }

  addDeveloper() {
    this.addEmployee(new AnalystEmployee())
    this.addEmployee(new DeveloperEmployee())
    this.addEmployee(new QaEmployee())
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
