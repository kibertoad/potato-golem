import EventEmitter from 'emitix'
import type { ChoiceId } from '../model/definitions/zones/01_district1/district1ChoiceDefinitions'

export type SpawnEntityParams = {
  entityId: ChoiceId
}

const boardEmitter = new EventEmitter<{
  spawnEntity: [SpawnEntityParams]
}>()

export type BoardEmitter = typeof boardEmitter

export const eventEmitters = {
  boardEmitter,
} as const satisfies Record<string, EventEmitter>
