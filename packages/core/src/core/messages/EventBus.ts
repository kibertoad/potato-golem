import { EventEmitter } from 'eventemitter3'

export type COMMON_EVENT_TYPES = 'DESTROY' | 'CREATE' | 'MOVE' | 'CHANGE_STATE'

export type EventSink<EventTypes extends string = COMMON_EVENT_TYPES> = {
  emit<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    ...args: EventEmitter.EventArgs<EventTypes, T>
  ): boolean
}

export type EventSource<EventTypes extends string = COMMON_EVENT_TYPES, Context = any> = {
  on<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    fn: EventEmitter.EventListener<EventTypes, T>,
    context?: Context,
  ): void
}

export const globalEventEmitter = new EventEmitter() satisfies EventSink<any> & EventSource<any>
