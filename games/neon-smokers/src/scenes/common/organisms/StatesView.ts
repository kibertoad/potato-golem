import { ButtonGridBuilder, PotatoContainer, type PotatoScene, StateListBuilder } from '@potato-golem/ui'
import { COMMON_EVENT_TYPES, EventSink, EventSource, LimitedNumber } from '@potato-golem/core'
import type { ImageId } from '../../../registries/imageRegistry'
import { ChoicesDirector } from '../../../model/director/ChoicesDirector'
import { WorldModel } from '../../../model/entities/WorldModel'
import Phaser from 'phaser'
import { choicesViewEventBus } from '../../../registries/eventEmitterRegistry'
import { CardViewParams, ChoicesViewDependencies } from './ChoicesView'

export type StatesViewDependencies = {
  worldModel: WorldModel
}

export class StatesView extends PotatoContainer {

  private readonly worldModel: WorldModel;

  constructor(
    scene: PotatoScene,
    dependencies: StatesViewDependencies
  ) {
    super(scene, {})
    this.worldModel = dependencies.worldModel

    this.x = 600
    this.y = 100
  }

  init() {
    const stateListBuilder = StateListBuilder.instance(this.scene, {
      startTextX: 900,
      startTextY: 200,
      offsetY: 100
    })

    stateListBuilder
      .add({
        labelText: 'Item 1',
        value: new LimitedNumber(0, 100, false, 'euro')
      })
      .add({
        labelText: 'Item 2',
        value: new LimitedNumber(0, 100, false, 'cred')
      })
    const stateListContainer = stateListBuilder.build()
    this.scene.add.existing(stateListContainer)
  }
}
