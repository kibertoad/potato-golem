export interface IdHolder {
  id: string
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
