import {
  type EventReceiver,
  type EventSink,
  type EventSource,
  type HPHolder,
  LimitedNumber,
} from '@potato-golem/core'
import Phaser from 'phaser'
import EventEmitter = Phaser.Events.EventEmitter

export class HomunculusModel implements EventReceiver, HPHolder {
  readonly eventSink: EventSource<'HEAL' | 'DAMAGE'> & EventSink<'HEAL' | 'DAMAGE'>
  readonly hp: LimitedNumber

  constructor() {
    this.eventSink = new EventEmitter()
    this.hp = new LimitedNumber(3, 3)

    this.registerListeners()
  }

  private registerListeners() {
    this.eventSink.on('HEAL', (amount: number) => {
      this.hp.increase(amount)
    })
    this.eventSink.on('DAMAGE', (amount: number) => {
      this.hp.decrease(amount)
    })
  }
}
