export type State<StateFlags extends string, MainStates extends string = ''> = {
  stateFlags: Record<StateFlags, boolean>
  mainState: MainStates
}

export interface StateHolder<StateFlags extends string, MainStates extends string = ''> {
  state: State<StateFlags, MainStates>
}
