import { Scene } from 'phaser'
import { validateFunction, validateNumber, validateString } from 'validation-utils'
import { Activation } from '../activations/ActivationTypes'

export type OnClickCallback = (button: any) => void

export class ButtonBuilder {
  #text?: string
  #textureKey?: string

  #displaySizeX?: number
  #displaySizeY?: number

  #positionX?: number
  #positionY?: number

  #onClick?: Activation | OnClickCallback

  readonly #scene: Scene
  readonly #targetList?: Phaser.GameObjects.Image[]

  constructor(scene: Scene, targetList?: Phaser.GameObjects.Image[]) {
    this.#scene = scene
    this.#targetList = targetList
  }

  public onclick(callback: Activation | OnClickCallback) {
    this.#onClick = callback

    return this
  }

  public text(value: string) {
    validateString(value, 'Text must be a string')

    this.#text = value
    return this
  }

  public textureKey(value: string) {
    this.#textureKey = value
    return this
  }

  public displaySize(x: number, y: number) {
    this.#displaySizeX = x
    this.#displaySizeY = y
    return this
  }

  public position(x: number, y: number) {
    this.#positionX = x
    this.#positionY = y
    return this
  }

  public build() {
    const newButton = this.#scene.add
      .image(
        validateNumber(this.#positionX, 'positionX must be a number'),
        validateNumber(this.#positionY, 'positionY must be a number'),
        validateString(this.#textureKey),
      )
      .setDisplaySize(
        validateNumber(this.#displaySizeX, 'displaySizeX must be a number'),
        validateNumber(this.#displaySizeY, 'displaySizeY must be a number'),
      )

    this.#scene.add.text(newButton.x, newButton.y, validateString(this.#text, `Button text must be a string, but it was ${JSON.stringify(this.#text)}`)).setOrigin(0.5)

    newButton.setInteractive()
    newButton.on(Phaser.Input.Events.POINTER_OVER, () => {
      newButton.setTint(0x66ff7f)
    })
    newButton.on(Phaser.Input.Events.POINTER_OUT, () => {
      newButton.setTint(0xffffff)
    })

    if (this.#onClick) {
      const callback = this.#onClick['execute'] ? () => { this.#onClick!['execute']() } : this.#onClick
      newButton.on(Phaser.Input.Events.POINTER_DOWN, validateFunction(callback))
    }

    if (this.#targetList) {
      this.#targetList.push(newButton)
    }

    console.log(`New Button: ${JSON.stringify(newButton)}`)
    console.log(`Button extra stuff: W: ${newButton.width}, H: ${newButton.height}`)
    console.log(`Button extra stuff: DW: ${newButton.displayWidth}, DH: ${newButton.displayHeight}`)

    return newButton
  }
}
