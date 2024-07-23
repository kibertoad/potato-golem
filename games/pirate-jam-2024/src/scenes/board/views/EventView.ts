import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import type { EventSink, EventSource } from '@potato-golem/core'
import type {
  EventEventId,
  SpawnCardMessage,
} from '../../../model/activations/event/eventActivations'
import type {
  EventDefinition,
  EventDefinitionGenerator,
  EventDefinitions,
} from '../../../model/definitions/eventDefinitions'
import type { WorldModel } from '../../../model/state/WorldModel'
import EventEmitter = Phaser.Events.EventEmitter
import { type PotatoScene, SpriteBuilder } from '@potato-golem/ui'
import { ButtonListBuilder } from '../../../builders/ButtonListBuilder'
import { ImageRegistry } from '../../../model/registries/imageRegistry'
import type { BoardSupportedEvents } from '../BoardScene'
import Sprite = Phaser.GameObjects.Sprite

export type EventViewDependencies = {
  worldModel: WorldModel
  eventDefinitionGenerator: EventDefinitionGenerator
  boardEventSink: EventSink<BoardSupportedEvents>
}

export class EventView extends Container {
  private readonly potatoScene: PotatoScene
  private readonly worldModel: WorldModel
  private readonly eventSink: EventSink<EventEventId> & EventSource<EventEventId>
  readonly eventDefinitions: EventDefinitions

  private currentEvent: EventDefinition

  private readonly background: Sprite
  private buttonList: ButtonListBuilder
  private boardEventSink: EventSink<BoardSupportedEvents>
  private eventText: Phaser.GameObjects.Text

  constructor(scene: PotatoScene, dependencies: EventViewDependencies) {
    super(scene)
    this.potatoScene = scene
    this.worldModel = dependencies.worldModel
    this.eventSink = new EventEmitter()
    this.boardEventSink = dependencies.boardEventSink

    this.eventDefinitions = dependencies.eventDefinitionGenerator.generateDefinitions(
      this.eventSink,
    )

    this.setX(0)
    this.setY(0)
    this.setDepth(100)

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

    this.background = SpriteBuilder.instance(this.potatoScene)
      .setTextureKey(ImageRegistry.EVENTS_BACKGROUND)
      .setPosition({
        x: 100,
        y: 100,
      })
      .setDepth(100)
      .setDimensions({
        width: 1560,
        height: 740,
      })
      .build()

    this.add(this.background)
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

  setToEvent(event: EventDefinition) {
    const { width, height } = this.scene.scale

    this.currentEvent = event

    if (this.buttonList) {
      this.buttonList.destroy()
    }

    const textStyle = {
      fontFamily: 'Arial', // Customize the font
      fontSize: '24px', // Customize the text size
      color: '#ffffff', // Customize the text color
      wordWrap: { width: 1200, useAdvancedWrap: true }, // Enable word wrap and set the width
    }

    // Create the text object with auto-wrap
    this.eventText = this.potatoScene.add.text(100, 100, event.description, textStyle)

    this.add(this.eventText)

    this.buttonList = new ButtonListBuilder(this.scene, {
      depth: 100,
      distance: 20,
      height: 50,
      width: 300,
      orientation: 'vertical',
      hoverTint: 0x66ff7f,
      position: {
        x: width / 2,
        y: height / 2,
      },
      textureKey: ImageRegistry.GLASS_PANEL,
    })

    for (const option of this.currentEvent.options) {
      const optionButton = this.buttonList.addButton(option.text, () => {
        console.log('clickety click')
        option.effect.activate()
      })
    }
  }
}
