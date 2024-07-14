import type { EmployeeModel } from '../../../model/state/employeeModel'
import Phaser from 'phaser'
import Sprite = Phaser.GameObjects.Sprite
import {
  type Position,
  type PotatoScene,
  SpriteBuilder,
  buildDragWithActivations,
  buildOnHover,
  restoreStartPosition,
  setEntityModel,
  setEntityType,
} from '@potato-golem/ui'
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import type { WorldModel } from '../../../model/state/worldModel'
import { AssignEngineerActivation } from '../activations/AssignEngineerActivation'
import type { TicketImageView } from './TicketImageView'

export type EmployeeViewParams = {
  model: EmployeeModel<unknown>
} & Position

export type EmployeeViewDependencies = {
  tickets: TicketImageView[]
  worldModel: WorldModel
}

export class EmployeeImageView {
  private readonly model: EmployeeModel<unknown>
  private readonly image: Sprite

  constructor(scene: PotatoScene, params: EmployeeViewParams, dependencies: EmployeeViewDependencies) {
    this.model = params.model

    dependencies.worldModel.addEmployee(this.model)

    const employeeImage = SpriteBuilder.instance(scene)
      .setTextureKey('logo')
      .setPosition({
        x: params.x,
        y: params.y,
      })
      .setWidth(100)
      .setHeight(100)
      .build()

    setEntityType(employeeImage, EntityTypeRegistry.ENGINEER)
    setEntityModel(employeeImage, this.model)

    buildOnHover(
      employeeImage,
      () => {
        console.log(`hovered (${this.model.area})`)
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
      potentialDropTargets: dependencies.tickets,
      potentialHoverTargets: [],
      dropActivations: {
        [EntityTypeRegistry.DEFAULT]: () => {
          console.log('Did not hit anything relevant, revert to original position')
          restoreStartPosition(employeeImage)
        },
        [EntityTypeRegistry.TICKET]: new AssignEngineerActivation(this.model),
      },
    })
  }
}
