import {
  PotatoScene,
  SpriteBuilder,
  createGlobalPositionLabel,
  updateGlobalPositionLabel,
} from '@potato-golem/ui'
import Phaser from 'phaser'

import { createGlobalTrackerLabel, updateGlobalTrackerLabel } from '@potato-golem/ui'
import type { Dependencies } from '../../model/diConfig'
import { CardModel } from '../../model/entities/CardModel'
import type { WorldModel } from '../../model/state/WorldModel'
import { Scenes } from '../SceneRegistry'
import { CardView } from './views/CardView'
import Sprite = Phaser.GameObjects.Sprite
import type { CommonEntity } from '@potato-golem/core'
import type {
  CardDefinitionGenerator,
  CardDefinitions,
  CardId,
} from '../../model/definitions/cardDefinitions'
import type { EventDefinitionGenerator } from '../../model/definitions/eventDefinitions'
import type { EndTurnProcessor } from '../../model/processors/EndTurnProcessor'
import { EntityTypeRegistry } from '../../model/registries/entityTypeRegistry'
import { ImageRegistry } from '../../model/registries/imageRegistry'
import type { Zone } from '../../model/registries/zoneRegistry'
import type { MusicScene } from '../MusicScene'
import { EventView } from './views/EventView'
import { ZoneView, type ZoneViewParams } from './views/ZoneView'

const debug = true

export class BoardScene extends PotatoScene {
  private readonly musicScene: MusicScene
  private readonly worldModel: WorldModel

  private globalPositionLabel: Phaser.GameObjects.Text
  private globalTrackerLabel: Phaser.GameObjects.Text

  private backgroundImage: Sprite
  private readonly endTurnProcessor: EndTurnProcessor
  private readonly cardDefinitionGenerator: CardDefinitionGenerator
  private cardDefinitions: CardDefinitions

  private zones: { string?: ZoneView } = {}
  private eventView: EventView
  private readonly eventDefinitionGenerator: EventDefinitionGenerator

  constructor({
    musicScene,
    eventDefinitionGenerator,
    cardDefinitionGenerator,
    worldModel,
    endTurnProcessor,
  }: Dependencies) {
    super(Scenes.BOARD_SCENE)

    this.musicScene = musicScene
    this.worldModel = worldModel
    this.endTurnProcessor = endTurnProcessor

    this.eventDefinitionGenerator = eventDefinitionGenerator
    this.cardDefinitions = cardDefinitionGenerator.generateDefinitions()
  }

  init() {
    this.eventView = new EventView(this, {
      worldModel: this.worldModel,
      eventDefinitionGenerator: this.eventDefinitionGenerator,
    })

    this.initZones()

    this.addCard('HEALTH', 'home')
    this.addCard('HEALTH', 'home')
    this.addCard('HEALTH', 'home')

    this.addCard('MEDICINE', 'lab')
    this.addCard('MEDICINE', 'lab')

    this.eventBus.on('DESTROY', (entity: CommonEntity) => {
      if (entity.type === EntityTypeRegistry.CARD) {
        this.worldModel.removeCard(entity.id)
        this.destroyChildByModelId(entity.id)
      }
    })

    this.eventView.setToEvent(this.eventView.eventDefinitions.INTRO)
  }

  initZones() {
    this.createZone({
      scene: this,
      id: 'alchemy',
      name: 'alchemy',
      debug: debug,
      spawnPoints: [
        {
          x: 0,
          y: 0,
        },
      ],
      vertices: [
        { x: 0, y: 12 },
        { x: 1282, y: 720 },
        { x: 0, y: 1440 },
      ],
    })

    this.createZone({
      scene: this,
      id: 'home',
      name: 'home',
      debug: debug,
      debugColor: Phaser.Display.Color.GetColor(0, 255, 0),
      spawnPoints: [
        {
          x: 1270,
          y: 240,
        },
      ],
      vertices: [
        { x: -18, y: 0 },
        { x: 1282, y: 720 },
        { x: 2560, y: 0 },
      ],
    })

    this.createZone({
      scene: this,
      id: 'streets',
      name: 'streets',
      debug: debug,
      debugColor: Phaser.Display.Color.GetColor(0, 0, 255),
      spawnPoints: [
        {
          x: 1270,
          y: 240,
        },
      ],
      vertices: [
        { x: 2560, y: 0 },
        { x: 1282, y: 720 },
        { x: 2560, y: 1440 },
      ],
    })

    this.createZone({
      scene: this,
      id: 'lab',
      name: 'lab',
      debug: debug,
      debugColor: Phaser.Display.Color.GetColor(255, 0, 255),
      spawnPoints: [
        {
          x: 1270,
          y: 1200,
        },
      ],
      vertices: [
        { x: 0, y: 1440 },
        { x: 1282, y: 720 },
        { x: 2560, y: 1440 },
      ],
    })

    this.createZone({
      scene: this,
      id: 'homunculus',
      name: 'homunculus',
      debug: debug,
      debugColor: Phaser.Display.Color.GetColor(255, 255, 0),
      spawnPoints: [
        {
          x: 1270,
          y: 240,
        },
      ],
      vertices: [
        { x: 1088, y: 835 },
        { x: 1088, y: 602 },
        { x: 1285, y: 500 },
        { x: 1472, y: 612 },
        { x: 1472, y: 855 },
        { x: 1282, y: 940 },
      ],
    })
  }

  createZone(zoneParams: ZoneViewParams) {
    const zoneView = new ZoneView(zoneParams, (pointedZoneView: ZoneView) => {
      for (const zone in this.zones) {
        this.zones[zone].unhighlight()
      }
      pointedZoneView.highlight()
    })
    this.addChildViewObject(zoneView)
    this.zones[zoneParams.id] = zoneView

    return zoneView
  }

  addCard(cardId: CardId, zone: Zone) {
    const cardModel = new CardModel({
      parentEventSink: this.eventBus,
      zone: zone,
      definition: this.cardDefinitions[cardId],
    })
    this.worldModel.addCard(cardModel)

    const zoneView = this.zones[zone]

    //pick random spawn point from zone
    const spawnPoint = zoneView.spawnPoints[Math.floor(Math.random() * zoneView.spawnPoints.length)]

    const cardView = new CardView(
      this,
      {
        model: cardModel,
        x: spawnPoint.x - CardView.cardWidth / 2,
        y: spawnPoint.y - CardView.cardHeight / 2,
      },
      {
        endTurnProcessor: this.endTurnProcessor,
      },
    )
    this.addChildViewObject(cardView)
  }

  preload() {}

  update() {
    updateGlobalPositionLabel(this.globalPositionLabel)
    updateGlobalTrackerLabel(this.globalTrackerLabel)
  }

  create() {
    this.musicScene.playBoardTheme()

    this.backgroundImage = SpriteBuilder.instance(this)
      .setTextureKey(ImageRegistry.BOARD_BACKGROUND)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setDepth(30)
      .setDimensions({
        width: 2560,
        height: 1440,
      })
      .build()

    this.globalPositionLabel = createGlobalPositionLabel(this)
    this.globalTrackerLabel = createGlobalTrackerLabel(this)
  }
}
