import { StateHolder } from "@potato-golem/core"
import { validateFunction } from 'validation-utils'

export interface StateTransition<View, Model extends StateHolder<StateFlags, MainStates>, StateFlags extends string, MainStates extends string> {
  exclusiveLock?: string // if set, only the first transition with this lock will be executed
  conditionPredicate (view: View, model: Model): boolean
  stateMutation(view: View, model: Model): void
}

export type Triggers = 'onClick'

export type ViewListener = {
  on(event: string | symbol, fn: Function, context?: any)
}

export class StateUIManager<View extends ViewListener, Model extends StateHolder<StateFlags, MainStates>, StateFlags extends string, MainStates extends string = ''> {
  private readonly view: View
  private readonly model: Model
  private readonly transitions: Record<Triggers, StateTransition<View, Model, StateFlags, MainStates>[]>

  constructor(view: View, model: Model) {
    this.view = view
    this.model = model
    this.transitions = {onClick: [] as StateTransition<View, Model, StateFlags, MainStates>[]}
  }

  addOnClickTransitionProcessing(onClickListener: ViewListener) {
    onClickListener.on(Phaser.Input.Events.POINTER_DOWN, () => {
      console.log('Process onClick transitions')
      this.processTransitions('onClick')
    })
  }

  addTransition(trigger: Triggers, transition: StateTransition<View, Model, StateFlags, MainStates>) {
    this.transitions[trigger].push(transition)
  }

  processTransitions(trigger: Triggers) {
    const exclusiveLocks: string[] = []
    for (const transition of this.transitions[trigger]) {
      if (
        transition.exclusiveLock && !exclusiveLocks.includes(transition.exclusiveLock) &&
        transition.conditionPredicate(this.view, this.model)) {
        transition.stateMutation(this.view, this.model)
        if ((transition.exclusiveLock)) {
          exclusiveLocks.push(transition.exclusiveLock)
        }
      }
    }
  }
}
