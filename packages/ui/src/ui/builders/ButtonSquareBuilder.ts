import type { Scene } from 'phaser'
import type { AbstractUIElement } from '../elements/UIGroup'
import type { ButtonBuilder } from './ButtonBuilder'
import { ButtonListBuilder1 } from './ButtonListBuilder1'

export class ButtonSquareBuilder extends ButtonListBuilder1 {
  #buttonListBuilder?: ButtonListBuilder1
  readonly #buttonLists: ButtonListBuilder1[]

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
      this.#buttonListBuilder = ButtonListBuilder1.from(this)
      this.#buttonLists.push(this.#buttonListBuilder)
    }
    if (this.#buttonListBuilder?.buttons?.length >= this.#rowSize!) {
      this.#buttonListBuilder = ButtonListBuilder1.from(this)
      this.#buttonLists.push(this.#buttonListBuilder)
      this.#buttonListBuilder?.setExactPosition(
        this.#buttonListBuilder.positionX!,
        this.#buttonListBuilder.positionY! +
          this.#buttonListBuilder?.displaySizeY! +
          this.#rowSpacingOffset!,
      )
    }

    this.buttonBuilder = this.initButtonBuilder(this.#buttonListBuilder)
    return this.buttonBuilder
  }

  build(): AbstractUIElement[] {
    return this.#buttonLists.flatMap((list) => {
      return list.getChildren()
    })
  }
}
