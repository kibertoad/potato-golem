import Container = Phaser.GameObjects.Container
import {
  buildDrag,
  Position,
  PotatoScene,
  restoreStartPosition,
  setEntityModel,
  setEntityType,
  SpriteBuilder, TextBuilder,
} from '@potato-golem/ui'
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import { TicketModel, TicketStatus } from '../model/entities/TicketModel'
import { canTransition } from '../model/stateMachines/ticketStateMachine'

export type TicketViewParams = {
  ticketModel: TicketModel
} & Position

const textOffsetX = 5
const textOffsetY = 5

export class TicketView extends Container {
  private readonly ticketSprite: Phaser.GameObjects.Sprite
  private readonly ticketModel: TicketModel
  private readonly ticketTitle: Phaser.GameObjects.Text

  constructor(scene: PotatoScene, params: TicketViewParams) {
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
    this.ticketSprite = SpriteBuilder.instance(scene)
      .setTextureKey('glass-panel')
      .setPosition({
        x: params.x,
        y: params.y,
      })
      .setWidth(100)
      .setHeight(100)
      .build()

    setEntityType(this.ticketSprite, EntityTypeRegistry.TICKET)
    setEntityModel(this.ticketSprite, this.ticketModel)

    this.add(this.ticketSprite)
    this.add(this.ticketTitle)
    scene.add.existing(this)

    buildDrag(
      this.ticketSprite,
      this,
      (pointer) => {
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
      {},
    )
  }
}
