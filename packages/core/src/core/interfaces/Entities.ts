import { LimitedNumber } from '../primitives/LimitedNumber'
import { EventSink } from '../messages/EventBus'

export interface IdHolder {
  id: string
}

export interface HPHolder {
  hp: LimitedNumber
}

export interface EventReceiver<T extends string = string> {
  eventSink: EventSink<T>
}

export interface TypeHolder {
  type: string
}

export interface Destroyable {
  destroy: () => void
}

export interface CommonEntity extends IdHolder, TypeHolder {}

export interface CommonView {
  model: IdHolder
}
