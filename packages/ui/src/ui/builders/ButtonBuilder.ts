import { Scene } from 'phaser'
import { validateFunction, validateNumber, validateString } from 'validation-utils'
import { Activation } from '../activations/ActivationTypes'
import { AbstractUIElement } from '../elements/UIGroup'
import { UIElementTemplate } from '../elements/UIElementTemplate'

export type OnClickCallback = (button: any) => void

export class ButtonBuilder {
  #text?: string
  #textureKey?: string

  #displaySizeX?: number
  #displaySizeY?: number

  #positionX?: number
  #positionY?: number

  #onClick?: Activation | OnClickCallback
  #onHover?: Activation | OnClickCallback
  #onUnhover?: Activation | OnClickCallback

  readonly #scene: Scene
  readonly #targetButtonList?: AbstractUIElement[]
  readonly #targetChildrenList?: AbstractUIElement[]

  constructor(
    scene: Scene,
    childrenList?: AbstractUIElement[],
    buttonList?: Phaser.GameObjects.Image[],
  ) {
    this.#scene = scene
    this.#targetButtonList = buttonList
    this.#targetChildrenList = childrenList
  }

  public template(template: UIElementTemplate) {
    if (template.displaySizeX) {
      this.#displaySizeX = template.displaySizeX
    }

    if (template.displaySizeY) {
      this.#displaySizeY = template.displaySizeY
    }

    if (template.onUnhover) {
      this.#onUnhover = template.onUnhover
    }

    if (template.onHover) {
      this.#onHover = template.onHover
    }

    if (template.text) {
      this.#text = template.text
    }
    if (template.onClick) {
      this.#onClick = template.onClick
    }
    if (template.textureKey) {
      this.#textureKey = template.textureKey
    }
    if (template.positionX) {
      this.#positionX = template.positionX
    }
    if (template.positionY) {
      this.#positionY = template.positionY
    }
  }

  public onClick(callback: Activation | OnClickCallback) {
    this.#onClick = callback

    return this
  }

  public onHover(callback: Activation | OnClickCallback) {
    this.#onHover = callback

    return this
  }

  public onUnhover(callback: Activation | OnClickCallback) {
    this.#onUnhover = callback

    return this
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

    let newText
    if (this.#text) {
      newText = this.#scene.add
        .text(
          newButton.x,
          newButton.y,
          validateString(
            this.#text,
            `Button text must be a string, but it was ${JSON.stringify(this.#text)}`,
          ),
        )
        .setOrigin(0.5)
    }

    newButton.setInteractive()
    newButton.on(Phaser.Input.Events.POINTER_OVER, () => {
      newButton.setTint(0x66ff7f)
    })
    newButton.on(Phaser.Input.Events.POINTER_OUT, () => {
      newButton.setTint(0xffffff)
    })

    if (this.#onClick) {
      const callback = this.#onClick['execute']
        ? () => {
            this.#onClick!['execute']()
          }
        : this.#onClick
      newButton.on(Phaser.Input.Events.POINTER_DOWN, validateFunction(callback))
    }

    if (this.#onHover) {
      const callback = this.#onHover['execute']
        ? () => {
            this.#onHover!['execute']()
          }
        : this.#onHover
      newButton.on(Phaser.Input.Events.POINTER_OVER, validateFunction(callback))
    }

    if (this.#onUnhover) {
      const callback = this.#onUnhover['execute']
        ? () => {
            this.#onUnhover!['execute']()
          }
        : this.#onUnhover
      newButton.on(Phaser.Input.Events.POINTER_OUT, validateFunction(callback))
    }

    if (this.#targetButtonList) {
      this.#targetButtonList.push(newButton)
    }

    if (this.#targetChildrenList) {
      this.#targetChildrenList.push(newButton)
      if (newText) {
        this.#targetChildrenList.push(newText)
      }
    }

    console.log(`New Button: ${JSON.stringify(newButton)}`)
    console.log(`Button extra stuff: W: ${newButton.width}, H: ${newButton.height}`)
    console.log(`Button extra stuff: DW: ${newButton.displayWidth}, DH: ${newButton.displayHeight}`)

    return newButton
  }
}
