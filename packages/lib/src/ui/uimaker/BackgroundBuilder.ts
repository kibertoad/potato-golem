import { Scene } from 'phaser'
import { validateFunction, validateNumber, validateString } from 'validation-utils'
import { Activation } from '../activations/ActivationTypes'
import { AbstractUIElement } from './UIGroup'

export class BackgroundBuilder {
  #text?: string
  #textureKey?: string

  #displaySizeX?: number
  #displaySizeY?: number

  #positionX?: number
  #positionY?: number

  textChild?: Phaser.GameObjects.Text

  readonly #scene: Scene
  readonly #targetBackgroundList?: AbstractUIElement[]
  readonly #targetChildrenList?: AbstractUIElement[]

  constructor(scene: Scene, childrenList?: AbstractUIElement[], backgroundList?: Phaser.GameObjects.Image[]) {
    this.#scene = scene
    this.#targetBackgroundList = backgroundList
    this.#targetChildrenList = childrenList
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
    const newBackground = this.#scene.add
      .image(
        validateNumber(this.#positionX, 'positionX must be a number'),
        validateNumber(this.#positionY, 'positionY must be a number'),
        validateString(this.#textureKey),
      )
      .setDisplaySize(
        validateNumber(this.#displaySizeX, 'displaySizeX must be a number'),
        validateNumber(this.#displaySizeY, 'displaySizeY must be a number'),
      )

    this.textChild = this.#scene.add.text(newBackground.x, newBackground.y, this.#text ?? '')
      .setOrigin(0.5)
      .setWordWrapWidth(newBackground.displayWidth)
      .setAlign('left')

    if (this.#targetBackgroundList) {
      this.#targetBackgroundList.push(newBackground)
    }

    if (this.#targetChildrenList) {
      this.#targetChildrenList.push(newBackground)
      if (this.textChild) {
        this.#targetChildrenList.push(this.textChild)
      }
    }

    return {
      text: this.textChild,
      background: newBackground,
    }
  }
}
