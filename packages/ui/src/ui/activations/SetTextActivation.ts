import { validateNotNil } from 'validation-utils'
import { UIContainer } from '../elements/UIContainer'
import { Activation, ActivationCallback } from '@potato-golem/core'

export class SetTextActivation implements Activation {
  private newText: string
  private targetObject: UIContainer<Phaser.GameObjects.Text>

  private constructor(targetObject: UIContainer<Phaser.GameObjects.Text>, newText: string) {
    this.targetObject = targetObject
    this.newText = newText
  }

  activate() {
    console.log('booyah')
    this.targetObject.value.text = this.newText
  }

  public static build(
    targetObject: UIContainer<Phaser.GameObjects.Text>,
    newText: string,
  ): ActivationCallback {
    validateNotNil(targetObject, 'targetObject cannot be null')
    const activation = new SetTextActivation(targetObject, newText)
    return () => {
      activation.activate()
    }
  }
}
