import { ButtonListBuilder, Position } from './ButtonListBuilder'
import { Scene } from 'phaser'
import { ButtonBuilder } from './ButtonBuilder'

export class ButtonSquareBuilder extends ButtonListBuilder {

  #buttonListBuilder?: ButtonListBuilder
  readonly #buttonLists: ButtonListBuilder[]

  #rowSize?: number
  #rowSpacingOffset?: number

  constructor(scene: Scene) {
    super(scene)
    this.#buttonLists = []
  }

  public rowSize(value: number) {
    this.#rowSize = value
    return this
  }

  public rowSpacingOffset(value: number) {
    this.#rowSpacingOffset = value
    return this
  }

  public override addButton(): ButtonBuilder {
    if (!this.#buttonListBuilder) {
      this.#buttonListBuilder = ButtonListBuilder.from(this)
      this.#buttonLists.push(this.#buttonListBuilder)
    }
    if (this.#buttonListBuilder?.buttons?.length >= this.#rowSize!) {
      this.#buttonListBuilder = ButtonListBuilder.from(this)
      this.#buttonLists.push(this.#buttonListBuilder)
      this.#buttonListBuilder?.setExactPosition(
        this.#buttonListBuilder.positionX!,
        this.#buttonListBuilder.positionY! + this.#buttonListBuilder?.displaySizeY! + this.#rowSpacingOffset!
      )
    }

    this.buttonBuilder = this.initButtonBuilder(this.#buttonListBuilder)
    return this.buttonBuilder
  }

}