import { ButtonBuilder } from './ButtonBuilder'
import { Scene } from 'phaser'
import { validateNumber, validateString } from 'validation-utils'
import { Position } from '../common/CommonUITypes'
import { AbstractUIElement, CommonUIGroup, UIGroup } from './UIGroup'

export class ButtonListBuilder extends CommonUIGroup{
  public readonly buttons: Phaser.GameObjects.Image[]
  protected buttonBuilder?: ButtonBuilder
  protected scene: Scene

  #textureKey?: string

  public displaySizeX?: number
  public displaySizeY?: number

  public positionX?: number
  public positionY?: number

  #spacingOffsetX?: number
  #spacingOffsetY?: number

  constructor(scene: Scene) {
    super()
    this.buttons = []
    this.scene = scene
  }

  public textureKey(value: string) {
    this.#textureKey = value
    return this
  }

  public displaySize(x: number, y: number) {
    this.displaySizeX = x
    this.displaySizeY = y
    return this
  }

  public setExactPosition(x: number, y: number) {
    this.positionX = x
    this.positionY = y

    return this
  }

  public setSpacingOffset(x: number, y: number) {
    this.#spacingOffsetX = x
    this.#spacingOffsetY = y

    return this
  }

  protected resolveNextButtonPosition(): Position {
    validateNumber(this.positionX)
    validateNumber(this.positionY)

    if (!this.buttons.length) {
      return {
        x: this.positionX!,
        y: this.positionY!,
      }
    }

    const lastButton = this.buttons.at(-1)
    if (this.#spacingOffsetX) {
      return {
        x: lastButton!.x + lastButton!.displayWidth + this.#spacingOffsetX,
        y: this.positionY!,
      }
    }

    if (this.#spacingOffsetY) {
      return {
        x: this.positionX!,
        y: lastButton!.y + lastButton!.displayHeight + this.#spacingOffsetY,
      }
    }

    throw new Error('No offset defined for the button list')
  }

  protected initButtonBuilder(listBuilder: ButtonListBuilder) {
    const position = listBuilder.resolveNextButtonPosition()
    return new ButtonBuilder(listBuilder.scene, listBuilder.children, listBuilder.buttons)
      .position(position.x, position.y)
      .textureKey(validateString(listBuilder.#textureKey))
      .displaySize(validateNumber(listBuilder.displaySizeX), validateNumber(listBuilder.displaySizeY))
  }

  public static from(source: ButtonListBuilder) {
    return new ButtonListBuilder(source.scene)
      .displaySize(source.displaySizeX!, source.displaySizeY!)
      .setSpacingOffset(source.#spacingOffsetX!, source.#spacingOffsetY!)
      .setExactPosition(source.positionX!, source.positionY!)
      .textureKey(source.#textureKey!)
  }

  public addButton(): ButtonBuilder {
    this.buttonBuilder = this.initButtonBuilder(this)
    return this.buttonBuilder
  }

  public build(): AbstractUIElement[] {
    return this.getChildren()
  }
}