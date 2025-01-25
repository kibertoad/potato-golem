import type { ViewListener } from '../ui/state/StateUIManager'
import type { Activation } from '@potato-golem/core'

export function addOnClickActivation(onClickListener: ViewListener, activation: Activation) {
  onClickListener.on(Phaser.Input.Events.POINTER_DOWN, () => {
    activation.activate
  })
}
