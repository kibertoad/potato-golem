import type { EventSink, EventSource } from '@potato-golem/core'
import EventEmitter = Phaser.Events.EventEmitter

export const choicesViewEventBus: EventSink<'REFRESH'> & EventSource<'REFRESH'> = new EventEmitter
