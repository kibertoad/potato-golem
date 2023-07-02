import { PotatoScene } from '@potato-golem/ui/dist/src/ui/common/PotatoScene'
import { Scenes } from '../registries/SceneRegistry'
import { buildDragWithActivations } from '@potato-golem/ui/dist/src/ui/builders/DragBuilder'
import { ENTITY_TYPE_DATA_KEY } from '@potato-golem/ui/dist/src/ui/common/EntityDataKeys'
import { RoundRectangle } from 'phaser3-rex-plugins/templates/ui/ui-components'

export class BoardScene extends PotatoScene {

  constructor() {
    super(Scenes.BOARD_SCENE);
  }

  init() {
    const engineer = this.rexUI.add.roundRectangle(200, 200, 2, 2, 20)
      .setFillStyle(0xa22270, 1)
      .setStrokeStyle(2, 0xa98274)
      .setDepth(100)
      .setData(ENTITY_TYPE_DATA_KEY, 'engineer')

    const ticket = this.rexUI.add.roundRectangle(500, 500, 8, 8, 80)
      .setFillStyle(0xa98270, 1)
      .setStrokeStyle(2, 0xa98274)
      .setDepth(10)
      .setData(ENTITY_TYPE_DATA_KEY, 'ticket')

    const tickets = [ticket]

    buildDragWithActivations(engineer, tickets, {
      'ticket': (rect: RoundRectangle) => {
        console.log(rect.data.get(ENTITY_TYPE_DATA_KEY))
      }
    })

    //let counter = 0
    /*
    buildDrag(engineer, (pointer: Pointer) => {
      console.log(`counter: ${counter++}`)

      //console.log(`ticket: ${ticket.getBounds().x}/${ticket.getBounds().y}`)
      if(ticket.getBounds().contains(pointer.x, pointer.y)) {
        console.log('ticket overlap')
      }
    })

     */
  }

  preload() {

  }

  create() {

  }

}
