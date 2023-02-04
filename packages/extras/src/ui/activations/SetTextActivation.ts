import { Activation, ActivationCallback } from './ActivationTypes'
import { validateNotNil } from 'validation-utils'

export class SetTextActivation implements Activation{
  private newText: string
  private targetObject: Phaser.GameObjects.Text

  private constructor(targetObject: Phaser.GameObjects.Text, newText: string) {
    this.targetObject = targetObject
    this.newText = newText
  }

  activate() {
    console.log('booyah')
    this.targetObject.text = this.newText
  }

  public static build(targetObject: Phaser.GameObjects.Text, newText: string): ActivationCallback {
    validateNotNil(targetObject, 'targetObject cannot be null')
    const activation = new SetTextActivation(targetObject, newText)
    return () => { activation.activate() }
  }
}
