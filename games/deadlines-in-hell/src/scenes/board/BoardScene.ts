import {
  ButtonListBuilder1,
  PotatoScene,
  SpriteBuilder,
  buildOnHover,
  restoreStartPosition,
  setEntityModel,
  setEntityType,
} from '@potato-golem/ui'
import { buildDragWithActivations } from '@potato-golem/ui'
import Phaser from 'phaser'
import { AssignEngineerActivation } from './activations/AssignEngineerActivation'

import Sprite = Phaser.GameObjects.Sprite
import { ProcessorActivation } from '@potato-golem/core'
import type { Dependencies } from '../../model/diConfig'
import { AnalystEmployee } from '../../model/entities/AnalystEmployee'
import { DeveloperEmployee } from '../../model/entities/DeveloperEmployee'
import { QaEmployee } from '../../model/entities/QaEmployee'
import { Scenes } from '../../model/registries/SceneRegistry'
import { EntityTypeRegistry } from '../../model/registries/entityTypeRegistry'
import type { WorldModel } from '../../model/state/worldModel'
import { TicketModel } from './model/entities/TicketModel'
import type { NextTurnProcessor } from './model/processors/NextTurnProcessor'
import { BoardView } from './views/BoardView'
import { TicketView } from './views/TicketView'

export class BoardScene extends PotatoScene {
  private readonly nextTurnActivation: ProcessorActivation<NextTurnProcessor>
  private readonly worldModel: WorldModel

  private boardView!: BoardView
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
    this.boardView = new BoardView(this)
    this.viewParents.push(this.boardView)
  }

  addTicket() {
    const ticket = new TicketModel({
      name: 'Login',
      complexity: 5,
    })
    this.worldModel.addTicket(ticket)

    const ticketView = new TicketView(
      this,
      {
        ticketModel: ticket,
        x: 15,
        y: 15,
      },
      {
        swimlanes: this.boardView.swimlanes,
      },
    )
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

    // drag'n'drop for engineer
    buildDragWithActivations({
      draggedItem: employeeImage,
      dragStartItem: employeeImage,
      config: {
        tolerance: 250,
      },
      potentialDropTargets: this.ticketViews,
      potentialHoverTargets: [],
      dropActivations: {
        [EntityTypeRegistry.DEFAULT]: () => {
          console.log('Revert to original position')
          restoreStartPosition(employeeImage)
        },
        [EntityTypeRegistry.TICKET]: new AssignEngineerActivation(employeeModel),
      },
    })

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

    const _nextDayButton = buttonList
      .addButton()
      .text('Confirm')
      .onClick(this.nextTurnActivation)
      .build()
  }
}
