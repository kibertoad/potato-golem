// Add activations here

import { Activation } from '@potato-golem/core'

export class StartStoryActivation implements Activation {
  private readonly storyId: string

  constructor(storyId: string) {
    this.storyId = storyId
  }

  activate(): void {
    console.log(`Started story ${this.storyId}`)
  }
}
