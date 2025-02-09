import  { Scene } from 'phaser'
import { ButtonListBuilderConfig, ButtonListBuilderV3 } from './ButtonListBuilderV3'
import Container = Phaser.GameObjects.Container

export type ButtonSquareBuilderParams<SupportedImages extends string = string> = {
  rowSize: number
  rowSpacingOffset: number
} & ButtonListBuilderConfig<SupportedImages>

export class ButtonSquareBuilder<SupportedImages extends string = string> extends ButtonListBuilderV3<SupportedImages> {
  #buttonListBuilder?: ButtonListBuilderV3<SupportedImages>
  readonly #buttonLists: ButtonListBuilderV3<SupportedImages>[]

  #rowSize?: number
  #rowSpacingOffset?: number

  constructor(scene: Scene, params: ButtonSquareBuilderParams<SupportedImages>) {
    super(scene, params)
    this.#buttonLists = []
    this.#rowSize = params.rowSize
    this.#rowSpacingOffset = params.rowSpacingOffset
  }

  public rowSize(value: number) {
    this.#rowSize = value
    return this
  }

  public rowSpacingOffset(value: number) {
    this.#rowSpacingOffset = value
    return this
  }

  public override addButton(text: string, onClick?: () => void): void {
    if (!this.#buttonListBuilder) {
      this.#buttonListBuilder = ButtonListBuilderV3.from(this, {
        orientation: 'horizontal',
      })
      this.#buttonLists.push(this.#buttonListBuilder)
    }
    if (this.#buttonListBuilder?.buttons?.length >= this.#rowSize!) {
      this.#buttonListBuilder = ButtonListBuilderV3.from(this, {
        orientation: 'horizontal',
        position: {
          x: this.#buttonListBuilder.position.x!,
          y: this.#buttonListBuilder.position.y! +
            this.#buttonListBuilder?.height! +
            this.#rowSpacingOffset!,
        }
      })
      this.#buttonLists.push(this.#buttonListBuilder)
    }

    this.#buttonListBuilder.addButton(text, onClick)
    //this.buttonBuilder = this.initButtonBuilder(this.#buttonListBuilder)
    //return this.buttonBuilder
  }

  override build(): Phaser.GameObjects.Container {
    const container = new Container(this.scene)

    this.#buttonLists.flatMap((list) => {
      container.add(list.build())
    })
    this.scene.add.existing(container)

    return container
  }
}
