import { Activation } from '@potato-golem/core'

export class EndStoryActivation implements Activation {
  activate(): void {
    console.log(`Ended story`)
  }
}
