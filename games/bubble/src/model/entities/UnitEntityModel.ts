import { CommonEntity, Coords, CoordsHolder, generateUuid, LimitedNumber, State, StateHolder } from '@potato-golem/core'

export type UnitEntityParams = {
  powerValue: number
  coords: Coords
}

export type UnitStates = 'isSelected'

export class UnitEntityModel implements CommonEntity, CoordsHolder, StateHolder<UnitStates> {

  public readonly id: string
  public readonly type: string
  public readonly powerValue: LimitedNumber
  public readonly coords: Coords
  public readonly state: State<UnitStates>

  constructor(params: UnitEntityParams) {
    this.powerValue = new LimitedNumber(params.powerValue, 21, false)
    this.coords = { x: params.coords.x, y: params.coords.y }
    this.type = 'soldier'
    this.id = generateUuid()
    this.state = {
      stateFlags: {
        isSelected: false,
      },
      mainState: ''
    }
  }
}
