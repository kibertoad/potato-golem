import { ENTITY_MODEL, ENTITY_TYPE_DATA_KEY } from '../common/EntityDataKeys'
import { AbstractUIElementLite } from './UIGroup'

export const DEFAULT_ENTITY_TYPE = 'DEFAULT'

export function storeStartPosition(item: AbstractUIElementLite) {
  item.setData({ startX: item.x, startY: item.y })
}

export function restoreStartPosition(item: AbstractUIElementLite) {
  item.setPosition(item.data.get('startX'), item.data.get('startY'))
}

export function setEntityType(item: AbstractUIElementLite, entityType: string) {
  item.setData(ENTITY_TYPE_DATA_KEY, entityType)
}

export function setEntityModel(item: AbstractUIElementLite, entityModel: object) {
  item.setData(ENTITY_MODEL, entityModel)
}

export function getEntityType(item: AbstractUIElementLite) {
  return item.getData(ENTITY_TYPE_DATA_KEY)
}

export function getEntityModel<T = any>(item: AbstractUIElementLite): T {
  return item.getData(ENTITY_MODEL)
}
