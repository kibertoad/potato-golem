import {
  PotatoScene,
  SpriteBuilder,
  createGlobalPositionLabel,
  updateGlobalPositionLabel,
} from '@potato-golem/ui'
import Phaser from 'phaser'

import { createGlobalTrackerLabel, updateGlobalTrackerLabel } from '@potato-golem/ui'
import { ChoiceModel } from '../../model/entities/narrative/ChoiceModel'
import type { WorldModel } from '../../model/entities/WorldModel'
import type { Dependencies } from '../../model/diConfig'
import { sceneRegistry } from '../../registries/sceneRegistry'
import Sprite = Phaser.GameObjects.Sprite
import type { CommonEntity } from '@potato-golem/core'
import { district1ChoiceDefinitions } from '../../model/definitions/zones/01_district1/district1ChoiceDefinitions'
import type { EndTurnProcessor } from '../../model/processors/EndTurnProcessor'
import { DepthRegistry } from '../../model/registries/depthRegistry'
import { EntityTypeRegistry } from '../../model/registries/entityTypeRegistry'
import { imageRegistry } from '../../registries/imageRegistry'
import { ChoicesView } from '../common/organisms/ChoicesView'
import {ChoicesDirector} from "../../model/director/ChoicesDirector";

export class ZoneScene extends PotatoScene {
  private readonly worldModel: WorldModel

  private globalPositionLabel: Phaser.GameObjects.Text
  private globalTrackerLabel: Phaser.GameObjects.Text

  private backgroundImage: Sprite
  private readonly endTurnProcessor: EndTurnProcessor
  private choicesView: ChoicesView
  private readonly choicesDirector: ChoicesDirector;

  constructor({ worldModel, endTurnProcessor, choicesDirector }: Dependencies) {
    super(sceneRegistry.BOARD_SCENE)

    this.worldModel = worldModel
    this.endTurnProcessor = endTurnProcessor
    this.choicesDirector = choicesDirector
  }

  init() {
    this.choicesView = new ChoicesView(this, {}, {
      worldModel: this.worldModel,
      choicesDirector: this.choicesDirector
    })
    this.choicesView.init()
  }

  preload() {}

  update() {
    updateGlobalPositionLabel(this.globalPositionLabel)
    updateGlobalTrackerLabel(this.globalTrackerLabel)
  }

  create() {
    this.backgroundImage = SpriteBuilder.instance(this)
      .setTextureKey(imageRegistry.ROCKET)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setDepth(DepthRegistry.BOARD_BACKGROUND)
      .setDimensions({
        width: 1900,
        height: 900,
      })
      .build()

    // ToDo reenable later
    this.backgroundImage.setVisible(false)

    this.globalPositionLabel = createGlobalPositionLabel(this)
    this.globalTrackerLabel = createGlobalTrackerLabel(this)
  }
}
