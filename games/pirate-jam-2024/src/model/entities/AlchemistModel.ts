import { EventReceiver, type EventSink, EventSource, HPHolder, LimitedNumber } from '@potato-golem/core'
import Phaser from 'phaser'
import EventEmitter = Phaser.Events.EventEmitter

export class AlchemistModel implements EventReceiver, HPHolder{
  readonly eventSink: EventSource<'HEAL'> & EventSink<'HEAL'>
  readonly hp: LimitedNumber

  constructor() {
    this.eventSink = new EventEmitter()
    this.hp = new LimitedNumber(5, 10)

    this.registerListeners()
  }

  private registerListeners() {
    this.eventSink.on('HEAL', (amount: number) => {
      this.hp.increase(amount)
    })
  }
}
