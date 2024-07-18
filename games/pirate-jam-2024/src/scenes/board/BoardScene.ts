import {
  PotatoScene,
  createGlobalPositionLabel, updateGlobalPositionLabel,
} from '@potato-golem/ui'
import type Phaser from 'phaser'

import {
  createGlobalTrackerLabel,
  updateGlobalTrackerLabel,
} from '@potato-golem/ui'
import { Scenes } from '../SceneRegistry'
import { CardModel } from '../../model/CardModel'
import { CardView } from './views/CardView'
import type { WorldModel } from '../../model/WorldModel'
import type { Dependencies } from '../../model/diConfig'

export class BoardScene extends PotatoScene {
  private readonly worldModel: WorldModel

  private globalPositionLabel: Phaser.GameObjects.Text
  private globalTrackerLabel: Phaser.GameObjects.Text
  private readonly cardViews: CardView[] = []

  constructor({ worldModel }: Dependencies) {
    super(Scenes.BOARD_SCENE)

    this.worldModel = worldModel

  }

  init() {
    this.addCard()
  }

  addCard() {
    const cardModel = new CardModel({
      name: 'Card',
    })
    this.worldModel.addCard(cardModel)

    const cardView = new CardView(
      this,
      {
        model: cardModel,
        x: 0,
        y: 0,
      },
      {

      },
    )
    this.cardViews.push(cardView)
  }

  preload() {}

  update() {
    updateGlobalPositionLabel(this.globalPositionLabel)
    updateGlobalTrackerLabel(this.globalTrackerLabel)
  }

  create() {
    this.globalPositionLabel = createGlobalPositionLabel(this)
    this.globalTrackerLabel = createGlobalTrackerLabel(this)
  }
}
