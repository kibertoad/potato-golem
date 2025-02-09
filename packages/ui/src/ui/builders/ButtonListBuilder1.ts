import type { Scene } from 'phaser'
import { validateNumber, validateString } from 'validation-utils'
import type { Position } from '../common/CommonUITypes'
import type { UIElementTemplate } from '../elements/UIElementTemplate'
import { type AbstractUIElement, CommonUIGroup, UIGroup } from '../elements/UIGroup'
import { ButtonBuilder } from './ButtonBuilder'

export class ButtonListBuilder1<SupportedImages extends string = string> extends CommonUIGroup {
  public readonly buttons: Phaser.GameObjects.Image[]
  protected buttonBuilder?: ButtonBuilder<SupportedImages>
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

  public template(template: UIElementTemplate) {
    if (template.displaySizeX) {
      this.displaySizeX = template.displaySizeX
    }

    if (template.displaySizeY) {
      this.displaySizeY = template.displaySizeY
    }

    if (template.textureKey) {
      this.#textureKey = template.textureKey
    }

    return this
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
    validateNumber(this.positionX, 'positionX is a mandatory field')
    validateNumber(this.positionY, 'positionY is a mandatory field')

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

  protected initButtonBuilder(listBuilder: ButtonListBuilder1<SupportedImages>) {
    const position = listBuilder.resolveNextButtonPosition()
    return new ButtonBuilder(listBuilder.scene, listBuilder.children, listBuilder.buttons)
      .position(position.x, position.y)
      .textureKey(validateString(listBuilder.#textureKey, 'textureKey is mandatory'))
      .displaySize(
        validateNumber(listBuilder.displaySizeX, 'displaySizeX is mandatory'),
        validateNumber(listBuilder.displaySizeY, 'displaySizeY is mandatory'),
      )
  }

  public static from<T extends string>(source: ButtonListBuilder1<T>) {
    return new ButtonListBuilder1(source.scene)
      .displaySize(source.displaySizeX!, source.displaySizeY!)
      .setSpacingOffset(source.#spacingOffsetX!, source.#spacingOffsetY!)
      .setExactPosition(source.positionX!, source.positionY!)
      .textureKey(source.#textureKey!)
  }

  public addButton(): ButtonBuilder<SupportedImages> {
    this.buttonBuilder = this.initButtonBuilder(this)
    return this.buttonBuilder
  }

  public build(): AbstractUIElement[] {
    return this.getChildren()
  }
}
