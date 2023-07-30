import { PotatoScene } from '@potato-golem/ui/dist/src/ui/common/PotatoScene'
import { Scenes } from '../registries/SceneRegistry'
import { buildDragWithActivations } from '@potato-golem/ui/dist/src/ui/builders/DragBuilder'
import { ENTITY_TYPE_DATA_KEY } from '@potato-golem/ui/dist/src/ui/common/EntityDataKeys'
import { Ticket, TicketStatus } from '../entities/Ticket'
import { buildDrag, DragIcon, ImageBoxBuilder, restoreStartPosition, setEntityType } from '@potato-golem/ui'
import { canTransition } from '../stateMachines/ticketStateMachine'
import { AssignEngineerActivation } from '../activations/AssignEngineerActivation'
import { EntityTypeRegistry } from '../registries/entityTypeRegistry'

export class BoardScene extends PotatoScene {

  constructor() {
    super(Scenes.BOARD_SCENE)
  }

  addTicket() {
    const ticket = new Ticket()

    const dragImage = ImageBoxBuilder.instance(this)
      .setTextureKey('glass-panel')
      .setPosition({
        x: 15,
        y: 15,
      })
      .setWidth(100)
      .setHeight(100)
      .build()

    const dragIcon = new DragIcon({
      x: 0,
      y: 0,
      model: ticket,
      image: dragImage,
      height: 50,
      width: 50,
    })
    setEntityType(dragImage, EntityTypeRegistry.TICKET)

    console.log(dragIcon)

    buildDrag(dragIcon.image, (pointer) => {
      const swimlaneSize = 1024 / 5
      const swimLane = Math.ceil(pointer.x / swimlaneSize)
      console.log(`Swimlane ${swimLane}`)

      const newStatus = Object.values(TicketStatus)[swimLane - 1]

      const ticketCanTransition = canTransition(ticket, newStatus)

      console.log(`Can transition: ${ticketCanTransition}`)

      if (!ticketCanTransition) {
        restoreStartPosition(dragIcon.image)
      } else {
        ticket.status = newStatus
      }
    })

    return dragIcon
  }

  init() {
    const engineer = this.add.circle(200, 200, 40)
      .setFillStyle(0xa22270, 1)
      .setStrokeStyle(2, 0xa98274)
      .setDepth(100)
      .setData(ENTITY_TYPE_DATA_KEY, 'engineer')

    /*
    const ticket = this.add.rectangle(500, 500, 80, 80)
      .setFillStyle(0xa98270, 1)
      .setStrokeStyle(2, 0xa98274)
      .setDepth(10)
      .setData(ENTITY_TYPE_DATA_KEY, 'ticket')

     */

    const realTicket = this.addTicket()

    const tickets = [realTicket.image]

    buildDragWithActivations(engineer, tickets, {
      [EntityTypeRegistry.DEFAULT]: () => {
        restoreStartPosition(engineer)
      },
      [EntityTypeRegistry.TICKET]: new AssignEngineerActivation(realTicket.model),
      //(engineer: RoundRectangle) => {
      //console.log(engineer.data.get(ENTITY_TYPE_DATA_KEY))
      //}
    })
  }

  preload() {

  }

  create() {

  }

}

