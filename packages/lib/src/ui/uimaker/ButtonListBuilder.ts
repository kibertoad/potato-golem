import { ButtonBuilder } from './ButtonBuilder'
import { Scene } from 'phaser'
import { validateNumber, validateString } from 'validation-utils'

export type Position = {
  x: number
  y: number
}

export class ButtonListBuilder {
  readonly #buttons: Phaser.GameObjects.Image[]
  #buttonBuilder?: ButtonBuilder
  #scene: Scene

  #textureKey?: string

  #displaySizeX?: number
  #displaySizeY?: number

  #positionX?: number
  #positionY?: number

  #spacingOffsetX?: number
  #spacingOffsetY?: number

  constructor(scene: Scene) {
    this.#buttons = []
    this.#scene = scene
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

  public setExactPosition(x: number, y: number) {
    this.#positionX = x
    this.#positionY = y

    return this
  }

  public setSpacingOffset(x: number, y: number) {
    this.#spacingOffsetX = x
    this.#spacingOffsetY = y

    return this
  }

  private resolveNextButtonPosition(): Position {
    validateNumber(this.#positionX)
    validateNumber(this.#positionY)

    if (!this.#buttons.length) {
      return {
        x: this.#positionX!,
        y: this.#positionY!
      }
    }

    const lastButton = this.#buttons.at(-1)
    if (this.#spacingOffsetX) {
      return {
        x: lastButton!.x + lastButton!.displayWidth + this.#spacingOffsetX,
        y: this.#positionY!
      }
    }

    if (this.#spacingOffsetY) {
      return {
        x: this.#positionX!,
        y: lastButton!.y + lastButton!.displayHeight + this.#spacingOffsetY,
      }
    }

    throw new Error('No offset defined for the button list')
  }

  public addButton(): ButtonBuilder {
    const position = this.resolveNextButtonPosition()

    this.#buttonBuilder = new ButtonBuilder(this.#scene, this.#buttons)
      .position(position.x, position.y)
      .textureKey(validateString(this.#textureKey))
      .displaySize(validateNumber(this.#displaySizeX), validateNumber(this.#displaySizeY))

    return this.#buttonBuilder
  }
}