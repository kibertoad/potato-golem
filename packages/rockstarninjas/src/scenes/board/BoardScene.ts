import { PotatoScene } from '@potato-golem/ui/dist/src/ui/common/PotatoScene'
import { Scenes } from '../../registries/SceneRegistry'
import { buildDragWithActivations } from '@potato-golem/ui/dist/src/ui/builders/DragBuilder'
import { ENTITY_MODEL, ENTITY_TYPE_DATA_KEY } from '@potato-golem/ui/dist/src/ui/common/EntityDataKeys'
import { Ticket, TicketStatus } from './entities/Ticket'
import {
  buildDrag, buildOnHover,
  ButtonListBuilder1, ChangeSceneActivation,
  DragIcon,
  ImageBoxBuilder,
  restoreStartPosition, setEntityModel,
  setEntityType, SpriteBuilder,
} from '@potato-golem/ui'
import { canTransition } from './stateMachines/ticketStateMachine'
import { AssignEngineerActivation } from './activations/AssignEngineerActivation'
import { EntityTypeRegistry } from '../../registries/entityTypeRegistry'
import { NextTurnActivation } from './activations/NextTurnActivation'
import { worldModel, WorldModel } from '../../model/worldModel'
import { DeveloperEmployee } from '../../entities/DeveloperEmployee'
import Sprite = Phaser.GameObjects.Sprite

export class BoardScene extends PotatoScene {

  private readonly nextTurnActivation: NextTurnActivation
  private readonly worldModel: WorldModel

  private readonly ticketViews: Sprite[]
  private readonly engineerViews: Sprite[]

  constructor() {
    super(Scenes.BOARD_SCENE)

    this.worldModel = worldModel
    this.nextTurnActivation = new NextTurnActivation(this.worldModel)
    this.ticketViews = []
    this.engineerViews = []
  }

  addTicketView(ticketModel: Ticket) {
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

    buildDrag(dragImage, (pointer) => {
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
    }, {
    })

    return dragImage
  }

  addTicket() {
    const ticket = new Ticket()
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

    buildOnHover(engineerImage, () => {
      console.log('hovered')
    }, () => {
      console.log('unhovered')
    }, {
    })


    buildDragWithActivations(engineerImage, this.ticketViews, {
      [EntityTypeRegistry.DEFAULT]: () => {
        console.log('Revert to original position')
        restoreStartPosition(engineerImage)
      },
      [EntityTypeRegistry.TICKET]: new AssignEngineerActivation(developerModel),
    }, {
      tolerance: 250
    })



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

  preload() {

  }

  create() {
    const { width, height } = this.scale;
    const buttonList = new ButtonListBuilder1(this)
      .textureKey("violet")
      .displaySize(150, 50)
      .setExactPosition(width * 0.5, height * 0.6)
      .setSpacingOffset(0, 10);

    const nextDayButton = buttonList
      .addButton()
      .text("Confirm")
      .onClick(this.nextTurnActivation)
      .build();
  }

}

