import EventEmitter from 'emitix'
import type { EntityId } from '../model/definitions/entityDefinitions'

export type SpawnEntityParams = {
  entityId: EntityId
}

const boardEmitter = new EventEmitter<{
  spawnEntity: [SpawnEntityParams]
}>()

export type BoardEmitter = typeof boardEmitter

export const eventEmitters = {
  boardEmitter,
} as const satisfies Record<string, EventEmitter>
