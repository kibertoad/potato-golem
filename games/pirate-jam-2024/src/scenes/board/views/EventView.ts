import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import type { EventSink, EventSource } from '@potato-golem/core'
import { type PotatoScene, SpriteBuilder } from '@potato-golem/ui'
import { ButtonListBuilder } from '../../../builders/ButtonListBuilder'
import type { EventEventId } from '../../../model/activations/event/eventActivations'
import {
  type EventDefinition,
  type EventDefinitions,
  type EventId,
  eventDefinitions,
} from '../../../model/definitions/eventDefinitions'
import { ImageRegistry } from '../../../model/registries/imageRegistry'
import type { WorldModel } from '../../../model/state/WorldModel'
import type { BoardSupportedEvents } from '../BoardScene'
import Sprite = Phaser.GameObjects.Sprite
import type { SpawnCardMessage } from '../../../model/activations/event/extraEventActivations'
import type { CardModel } from '../../../model/entities/CardModel'
import { DepthRegistry } from '../../../model/registries/depthRegistry'
import { EventEmitters } from '../../../model/registries/eventEmitterRegistry'

const EVENT_WINDOW_WIDTH = 1700
const EVENT_WINDOW_HEIGHT = 800

export type EventViewDependencies = {
  worldModel: WorldModel
  boardEventSink: EventSink<BoardSupportedEvents>
}

export class EventView extends Container {
  private readonly potatoScene: PotatoScene
  private readonly eventSink: EventSink<EventEventId> & EventSource<EventEventId>
  readonly eventDefinitions: EventDefinitions

  private currentEvent: EventDefinition

  private windowContainer: Container

  private readonly background: Sprite
  private buttonList: ButtonListBuilder
  private boardEventSink: EventSink<BoardSupportedEvents>
  private eventText: Phaser.GameObjects.Text

  constructor(scene: PotatoScene, dependencies: EventViewDependencies) {
    super(scene)
    this.potatoScene = scene
    this.eventSink = EventEmitters.eventViewEmitter
    this.boardEventSink = dependencies.boardEventSink
    this.eventDefinitions = eventDefinitions

    this.setX(0)
    this.setY(0)
    this.setDepth(DepthRegistry.EVENT)

    /*
    this.backSlice = this.scene.add.nineslice(
      100,  // x position
      100,  // y position
      ImageRegistry.SMOKES_9PATCH,  // key of the texture you loaded
      undefined,  // frame, optional
      1560,  // initial width of the nine-patch
      740,  // initial height of the nine-patch
      213,  // left width for the slice
      213,  // right width for the slice
      160,  // top height for the slice
      160   // bottom height for the slice
    )
      .setOrigin(0, 0)
      .setDepth(90);
    this.add(this.backSlice)
     */

    const backdrop = new Phaser.GameObjects.Rectangle(scene, 1280, 720, 2560, 1440, 0, 0.5)
    backdrop.setInteractive({
      draggable: false,
      pixelPerfect: false,
      alphaTolerance: undefined,
      useHandCursor: false,
    })
    this.add(backdrop)

    this.windowContainer = new Phaser.GameObjects.Container(
      scene,
      1280 - EVENT_WINDOW_WIDTH / 2,
      720 - EVENT_WINDOW_HEIGHT / 2,
    )
    this.windowContainer.width = EVENT_WINDOW_WIDTH
    this.windowContainer.height = EVENT_WINDOW_HEIGHT

    this.background = SpriteBuilder.instance(this.potatoScene)
      .setTextureKey(ImageRegistry.EVENTS_BACKGROUND)
      .setDimensions({
        width: EVENT_WINDOW_WIDTH,
        height: EVENT_WINDOW_HEIGHT,
      })
      .setPosition({
        x: 0,
        y: 0,
      })
      .build()
    this.hide()

    this.windowContainer.add(this.background)
    this.add(this.windowContainer)

    this.scene.add.existing(this)

    this.registerListeners()
  }

  private registerListeners() {
    this.eventSink.on('conclude_event', () => {
      this.buttonList.destroy()
      this.buttonList = null
      this.eventText.destroy()
      this.eventText = null
      this.currentEvent = null

      this.hide()
    })

    this.eventSink.on('next_event', (event: EventId) => {
      this.buttonList.destroy()
      this.eventText.destroy()
      this.setToEvent(event)
    })

    this.eventSink.on('spawn_card', (message: SpawnCardMessage) => {
      this.boardEventSink.emit('spawn_card', message)
    })
  }

  public show() {
    this.setVisible(true)
  }

  public hide() {
    this.setVisible(false)
  }

  setToEvent(event: EventId, targetCard?: CardModel) {
    const { width, height } = this.scene.scale

    this.currentEvent = this.eventDefinitions[event]
    if (!this.currentEvent) {
      throw new Error(`Unknown error: ${this.currentEvent} (${event})`)
    }

    if (this.buttonList) {
      this.buttonList.destroy()
    }

    const textStyle = {
      padding: {
        x: 30,
        y: 30,
      },
      fontFamily: 'Arial', // Customize the font
      fontSize: '34px', // Customize the text size
      color: '#ffffff', // Customize the text color
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#000000FF',
        blur: 5,
        stroke: true,
        fill: true,
      },
      wordWrap: { width: EVENT_WINDOW_WIDTH - 30, useAdvancedWrap: true }, // Enable word wrap and set the width
    }

    // Create the text object with auto-wrap
    this.eventText = this.potatoScene.add.text(
      0,
      0,
      this.currentEvent.description.trim(),
      textStyle,
    )
    this.windowContainer.add(this.eventText)

    this.buttonList = new ButtonListBuilder(this.scene, {
      distance: 20,
      height: 50,
      width: 400,
      orientation: 'horizontal',
      hoverTint: 0x66ff7f,
      position: {
        x: 20,
        y: EVENT_WINDOW_HEIGHT - 90,
      },
      textureKey: ImageRegistry.GLASS_PANEL,
    })

    for (const option of this.currentEvent.options) {
      const optionButton = this.buttonList.addButton(option.text, () => {
        console.log('clickety click')
        option.effect.activate.apply(option.effect, [targetCard])
      })
    }

    this.windowContainer.add(this.buttonList.build())
  }
}
