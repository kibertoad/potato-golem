import type { Scene } from 'phaser'
import { validateNumber, validateString } from 'validation-utils'
import type { PotatoScene } from '../common/PotatoScene'
import { UIContainer } from '../elements/UIContainer'
import type { AbstractUIElement, AbstractUIElementLite } from '../elements/UIGroup'

/**
 * Create a text label
 */
export class TextBuilder {
  #text?: string

  #displaySizeX?: number
  #displaySizeY?: number

  #positionX: number
  #positionY: number

  textChild?: Phaser.GameObjects.Text

  readonly #scene: Scene
  readonly #targetChildrenList?: AbstractUIElementLite[]

  constructor(scene: Scene, childrenList?: AbstractUIElement[]) {
    this.#positionX = 0
    this.#positionY = 0
    this.#scene = scene
    this.#targetChildrenList = childrenList
  }

  public setText(value: string) {
    validateString(value, 'Text must be a string')

    this.#text = value
    return this
  }

  public setDisplaySize(x: number, y: number) {
    this.#displaySizeX = x
    this.#displaySizeY = y
    return this
  }

  public setPosition({ x, y }: { x: number; y: number }) {
    this.#positionX = x
    this.#positionY = y
    return this
  }

  public build() {
    this.textChild = this.#scene.add
      .text(validateNumber(this.#positionX), validateNumber(this.#positionY), this.#text ?? '')
      .setOrigin(0.5, 0.5)
      .setWordWrapWidth(validateNumber(this.#displaySizeX))
      .setAlign('left')

    if (this.#targetChildrenList) {
      this.#targetChildrenList.push(this.textChild)
    }

    const textContainer = new UIContainer(this.textChild)

    return textContainer
  }

  static instance(scene: PotatoScene) {
    return new TextBuilder(scene)
  }
}
