import type { ViewListener } from '../ui/state/StateUIManager'
import type { Activation, ActivationCallback } from '@potato-golem/core'

export function addOnClickActivation(onClickListener: ViewListener, activation: ActivationCallback) {
  onClickListener.on(Phaser.Input.Events.POINTER_DOWN, () => {
    activation()
  })
}
