import type { Activation, ActivationCallback } from '@potato-golem/core'
import type Phaser from 'phaser'

export class ChangeSceneActivation implements Activation {
  readonly #newScene: Phaser.Scene | string
  readonly #currentScene: Phaser.Scene

  private constructor(currentScene: Phaser.Scene, newScene: Phaser.Scene | string) {
    this.#currentScene = currentScene
    this.#newScene = newScene
  }

  activate() {
    this.#currentScene.scene.start(this.#newScene)
  }

  public static build(
    currentScene: Phaser.Scene,
    newScene: Phaser.Scene | string,
  ): ActivationCallback {
    const activation = new ChangeSceneActivation(currentScene, newScene)
    return () => {
      activation.activate()
    }
  }
}
