import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import type {
  EventDefinition,
  EventDefinitionGenerator,
  EventDefinitions,
} from '../../../model/definitions/eventDefinitions'
import type { WorldModel } from '../../../model/state/WorldModel'
import type { EventEventId } from '../../../model/activations/event/eventActivations'
import type { EventSink, EventSource } from '@potato-golem/core'
import EventEmitter = Phaser.Events.EventEmitter
import GameObject = Phaser.GameObjects.GameObject
import { ImageRegistry } from '../../../model/registries/imageRegistry'
import { Scenes } from '../../SceneRegistry'
import { ButtonListBuilder } from '../../../builders/ButtonListBuilder'
import { PotatoScene } from '@potato-golem/ui'

export type EventViewDependencies = {
  worldModel: WorldModel
  eventDefinitionGenerator: EventDefinitionGenerator
}

export class EventView extends Container {

  private readonly potatoScene: PotatoScene
  private readonly worldModel: WorldModel
  private readonly eventSink: EventSink<EventEventId> & EventSource<EventEventId>
  readonly eventDefinitions: EventDefinitions

  private currentEvent: EventDefinition
  private buttonList: ButtonListBuilder

  constructor(scene: PotatoScene, dependencies: EventViewDependencies) {
    super(scene)
    this.potatoScene = scene
    this.worldModel = dependencies.worldModel
    this.eventSink = new EventEmitter()

    this.eventDefinitions = dependencies.eventDefinitionGenerator.generateDefinitions(this.eventSink)

    this.registerListeners()
  }

  private registerListeners() {
    this.eventSink.on('conclude_event', () => {
      this.buttonList.destroy()
      this.buttonList = null

      this.currentEvent = null
      this.visible = false
    })
  }

  setToEvent(event: EventDefinition) {
    const { width, height } = this.scene.scale

    this.currentEvent = event

    if (this.buttonList) {
      this.buttonList.destroy()
    }

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
      textureKey: ImageRegistry.GLASS_PANEL
    })

    for (const option of this.currentEvent.options) {
      const optionButton = this.buttonList
        .addButton(option.text, () => {
          console.log('clickety click')
          option.effect.activate(this.currentEvent)
        })
    }
  }
}
