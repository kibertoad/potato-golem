import { Scene } from 'phaser'
import { validateNumber, validateString } from 'validation-utils'
import { ChoiceOption, Position } from '../common/CommonUITypes'
import { PotatoScene } from '../common/PotatoScene'
import { GREENISH } from '../constants/Colours'
import { UIElementTemplate } from '../elements/UIElementTemplate'
import { AbstractUIElement, CommonUIGroup, UIGroup } from '../elements/UIGroup'
import { ButtonBuilder } from './ButtonBuilder'

export class ButtonListBuilder {
  public readonly buttons: Phaser.GameObjects.Image[]
  private readonly choiceOptions: ChoiceOption[]
  protected scene: PotatoScene

  #defaultFillColour?: number
  #highlightFillColour?: number

  public displaySizeX?: number
  public displaySizeY?: number

  public positionX?: number
  public positionY?: number

  #paddingHorizontal?: number

  #spacingOffsetX?: number
  #spacingOffsetY?: number

  constructor(scene: PotatoScene) {
    this.buttons = []
    this.choiceOptions = []
    this.scene = scene
    this.#paddingHorizontal = 0
  }

  public template(template: UIElementTemplate) {
    if (template.displaySizeX) {
      this.displaySizeX = template.displaySizeX
    }

    if (template.displaySizeY) {
      this.displaySizeY = template.displaySizeY
    }

    return this
  }

  public fillColour(value: number) {
    this.#defaultFillColour = value
    return this
  }

  public highlightFillColour(value: number) {
    this.#highlightFillColour = value
    return this
  }

  public displaySize(x: number, y: number) {
    this.displaySizeX = x
    this.displaySizeY = y
    return this
  }

  public paddingHorizontal(padding: number) {
    this.#paddingHorizontal = padding
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

  public static from(source: ButtonListBuilder) {
    return new ButtonListBuilder(source.scene)
      .displaySize(source.displaySizeX!, source.displaySizeY!)
      .setSpacingOffset(source.#spacingOffsetX!, source.#spacingOffsetY!)
      .setExactPosition(source.positionX!, source.positionY!)
  }

  private createButton(choiceOption: ChoiceOption) {
    const background = this.scene.rexUI.add.roundRectangle(
      0,
      0,
      validateNumber(this.displaySizeX),
      validateNumber(this.displaySizeY),
      20,
      this.#defaultFillColour,
    )
    const label = this.scene.rexUI.add.label({
      width: this.displaySizeX,
      height: this.displaySizeY,
      background,
      text: this.scene.add.text(0, 0, choiceOption.text, {
        fontSize: '18px',
      }),
      space: {
        left: this.#paddingHorizontal,
        right: this.#paddingHorizontal,
      },
      align: 'center',
    })

    label.on(Phaser.Input.Events.POINTER_OVER, () => {
      background.setFillStyle(this.#highlightFillColour)
    })
    label.on(Phaser.Input.Events.POINTER_OUT, () => {
      background.setFillStyle(this.#defaultFillColour)
    })

    if (choiceOption.activation) {
      label.on('click', choiceOption.activation)
    }
    return label
  }

  public addButton(choiceOption: ChoiceOption) {
    this.choiceOptions.push(choiceOption)
    return this
  }

  public build() {
    const expand = true
    const buttons = this.scene.rexUI.add
      .buttons({
        x: this.positionX,
        y: this.positionY,
        width: this.displaySizeX,
        orientation: 'x',

        buttons: this.choiceOptions.map((choiceOption) => {
          return this.createButton(choiceOption)
        }),

        space: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
          item: this.#spacingOffsetX,
        },
        expand: expand,
      })
      .layout()
    //      .drawBounds(this.scene.add.graphics(), 0xff0000)

    buttons.on('button.click', (button, index, pointer, event) => {
      button.emit('click')
    })
  }
}
