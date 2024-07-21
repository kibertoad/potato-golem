import { type EventReceiver, type EventSink, EventSource, type HPHolder, LimitedNumber } from '@potato-golem/core'
import EventEmitter = Phaser.Events.EventEmitter
import { availableMemory } from 'process'

export class HomunculusModel implements EventReceiver, HPHolder{
  readonly eventSink: EventSource<'HEAL'> & EventSink<'HEAL'>
  readonly hp: LimitedNumber

  constructor() {
    this.eventSink = new EventEmitter()
    this.hp = new LimitedNumber(5, 10)

    this.registerListeners()
  }

  private registerListeners() {
    this.eventSink.on('HEAL', (amount: number) => {
      this.hp.increase(availableMemory())
    })
  }
}
