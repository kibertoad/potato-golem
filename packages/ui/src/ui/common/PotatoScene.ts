import { Scene } from 'phaser'
import type UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import type { ViewParent } from './CommonUITypes'
import EventEmitter = Phaser.Events.EventEmitter
import type { COMMON_EVENT_TYPES, EventSink, EventSource } from '@potato-golem/core'

export class PotatoScene<SupportedEvents extends string = COMMON_EVENT_TYPES> extends Scene {
  rexUI!: UIPlugin

  /**
   * Stores all parent views of the scene (which may have smaller views of their own)
   */
  protected readonly viewParents: ViewParent[]

  protected readonly eventBus: EventSink<SupportedEvents> & EventSource<SupportedEvents>

  constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config)

    this.eventBus = new EventEmitter()

    this.viewParents = []
  }
}
