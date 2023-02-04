import { PotatoScene } from '../common/PotatoScene'
import { Position } from '../common/CommonUITypes'

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

  public setWidth(width: number) {
    this.width = width
    return this
  }

  public setHeight(height: number) {
    this.height = height
    return this
  }
}