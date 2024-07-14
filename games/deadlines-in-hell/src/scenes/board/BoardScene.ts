import {
  ButtonListBuilder1,
  PotatoScene,
  createGlobalPositionLabel, updateGlobalPositionLabel,
} from '@potato-golem/ui'
import type Phaser from 'phaser'

import { ProcessorActivation } from '@potato-golem/core'
import type { Dependencies } from '../../model/diConfig'
import { AnalystEmployee } from '../../model/entities/AnalystEmployee'
import { DeveloperEmployee } from '../../model/entities/DeveloperEmployee'
import { QaEmployee } from '../../model/entities/QaEmployee'
import { Scenes } from '../../model/registries/SceneRegistry'
import type { WorldModel } from '../../model/state/worldModel'
import { TicketModel } from './model/entities/TicketModel'
import type { NextTurnProcessor } from './model/processors/NextTurnProcessor'
import { BoardView } from './views/BoardView'
import { TicketImageView } from './views/TicketImageView'
import { EmployeeImageView } from './views/EmployeeImageView'
import type { EmployeeModel } from '../../model/state/employeeModel'

export class BoardScene extends PotatoScene {
  private readonly nextTurnActivation: ProcessorActivation<NextTurnProcessor>
  private readonly worldModel: WorldModel

  private boardView!: BoardView
  private readonly ticketViews: TicketImageView[]
  private readonly engineerViews: EmployeeImageView[]
  private globalPositionLabel: Phaser.GameObjects.Text

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

    const ticketView = new TicketImageView(
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

  addEmployee(employeeModel: EmployeeModel<unknown>) {
    const employeeView = new EmployeeImageView(this, {
      model: employeeModel,
      x: 250,
      y: 200
    }, {
      worldModel: this.worldModel,
      tickets: this.ticketViews
    })

    this.engineerViews.push(employeeView)
  }

  addDeveloper() {
    this.addEmployee(new AnalystEmployee())
    this.addEmployee(new DeveloperEmployee())
    this.addEmployee(new QaEmployee())
  }

  preload() {}

  update() {
    updateGlobalPositionLabel(this.globalPositionLabel)
  }

  create() {
    this.globalPositionLabel = createGlobalPositionLabel(this)

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
