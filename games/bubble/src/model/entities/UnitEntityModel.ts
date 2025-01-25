import {
  type CommonEntity,
  type Coords,
  type CoordsHolder,
  LimitedNumber,
  type State,
  type StateHolder,
  generateUuid,
} from '@potato-golem/core'

export type UnitEntityParams = {
  powerValue: number
  coords: Coords
  side: Sides
}

export type UnitStates = 'isSelected'

export type Sides = keyof typeof SIDES
export const SIDES = {
  RED: 'RED',
  BLUE: 'BLUE',
} as const

export class UnitEntityModel implements CommonEntity, CoordsHolder, StateHolder<UnitStates> {
  public readonly id: string
  public readonly side: Sides
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
      mainState: '',
    }
    this.side = params.side
  }
}
