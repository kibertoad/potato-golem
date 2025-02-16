import EventEmitter from 'emitix'
import type { ChoiceId } from '../model/definitions/01_district1/choiceDefinitions'

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
