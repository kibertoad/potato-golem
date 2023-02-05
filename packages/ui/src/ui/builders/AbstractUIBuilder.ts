import { PotatoScene } from '../common/PotatoScene'
import { Position } from '../common/CommonUITypes'
import { validateNumber } from 'validation-utils'

export abstract class AbstractUIBuilder {
  protected readonly scene: PotatoScene
  protected position?: Position
  protected width?: number
  protected height?: number


  constructor(scene: PotatoScene) {
    this.scene = scene
  }

  public setPosition(position: Position) {
    this.position = {
      ...position
    }
    return this
  }

  public getX() {
    return validateNumber(this.position?.x)
  }

  public getY() {
    return validateNumber(this.position?.y)
  }


  public getWidth() {
    return validateNumber(this.width)
  }

  public getHeight() {
    return validateNumber(this.height)
  }

  public setWidth(width: number) {
    this.width = width
    return this
  }

  public setHeight(height: number) {
    this.height = height
    return this
  }
}