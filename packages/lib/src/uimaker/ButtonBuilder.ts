import { Scene } from 'phaser'
import { validateFunction, validateNumber, validateString } from 'validation-utils'

export type OnClickCallback = (button: any) => {}

export class ButtonBuilder {
  #text?: string
  #textureKey?: string

  #displaySizeX?: number
  #displaySizeY?: number

  #positionX?: number
  #positionY?: number

  #onClick?: OnClickCallback

  readonly #scene: Scene
  readonly #targetList?: Phaser.GameObjects.Image[]

  constructor(scene: Scene, targetList?: Phaser.GameObjects.Image[]) {
    this.#scene = scene
    this.#targetList = targetList
  }

  public onclick(callback: OnClickCallback) {
    this.#onClick = callback
  }

  public text(value: string) {
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

    this.#scene.add.text(newButton.x, newButton.y, validateString(this.#text)).setOrigin(0.5)

    newButton.setInteractive()
    newButton.on(Phaser.Input.Events.POINTER_OVER, () => {
      newButton.setTint(0x66ff7f)
    })
    newButton.on(Phaser.Input.Events.POINTER_OUT, () => {
      newButton.setTint(0xffffff)
    })

    if (this.#onClick) {
      newButton.on(Phaser.Input.Events.POINTER_DOWN, validateFunction(this.#onClick))
    }

    if (this.#targetList) {
      this.#targetList.push(newButton)
    }

    return newButton
  }
}
