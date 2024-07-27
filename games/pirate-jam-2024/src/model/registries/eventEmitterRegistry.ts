import Phaser from 'phaser'
import EventEmitter = Phaser.Events.EventEmitter

export const EventEmitters = {
  boardEventEmitter: new EventEmitter(),
  eventViewEmitter: new EventEmitter(),
} as const satisfies Record<string, EventEmitter>
