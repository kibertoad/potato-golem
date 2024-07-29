import {
  type EventReceiver,
  type EventSink,
  type EventSource,
  type HPHolder,
  LimitedNumber,
} from '@potato-golem/core'
import Phaser from 'phaser'
import EventEmitter = Phaser.Events.EventEmitter

export type HomunculusEvents = 'HEAL' | 'DAMAGE' | 'FEED' | 'STARVE' | 'DEATH'

export class HomunculusModel implements EventReceiver, HPHolder {
  readonly eventSink: EventSource<HomunculusEvents> & EventSink<HomunculusEvents>
  readonly hp: LimitedNumber
  readonly food: LimitedNumber

  //If we end the turn by feeding, we don't want to starve during the same turn
  private starveProtection = false

  constructor() {
    this.eventSink = new EventEmitter()
    this.hp = new LimitedNumber(3, 3)
    this.food = new LimitedNumber(3, 3)

    this.registerListeners()
  }

  public reset() {
    this.hp.setToMax()
    this.food.setToMax()
  }

  private registerListeners() {
    this.eventSink.on('HEAL', (amount: number) => {
      this.hp.increase(amount)
    })
    this.eventSink.on('DAMAGE', (amount: number) => {
      this.hp.decrease(amount)
      if (this.hp.value <= 0) {
        this.eventSink.emit('DEATH')
      }
    })
    this.eventSink.on('FEED', (amount: number, feedProtection = false) => {
      this.food.increase(amount)
      this.starveProtection = feedProtection
    })
    this.eventSink.on('STARVE', (amount: number) => {
      if (this.starveProtection) {
        this.starveProtection = false
        return
      }
      if (this.food.value <= 0) {
        this.eventSink.emit('DAMAGE', 1)
      }
      this.food.decrease(amount)
    })
  }
}
