import { validateNumber } from 'validation-utils'
import type { Dimensions, Position } from '../common/CommonUITypes'
import type { PotatoScene } from '../common/PotatoScene'
import Sprite = Phaser.GameObjects.Sprite
import type { Coords } from '@potato-golem/core'
import { Scene } from 'phaser'

export abstract class AbstractUIBuilder {
  protected readonly scene: PotatoScene
  protected position: Position
  protected width: number
  protected height: number
  protected originX?: number
  protected originY?: number
  protected depth?: number

  constructor(scene: PotatoScene) {
    this.scene = scene
    this.position = {
      x: 0,
      y: 0,
    }
    this.height = 20
    this.width = 20
  }

  public setOrigin(originX: number, originY: number) {
    this.originX = originX
    this.originY = originY

    return this
  }

  public setPosition(position: Position) {
    this.position = {
      ...position,
    }
    return this
  }

  /**
   * Higher depth means being drawn on top
   */
  public setDepth(depth: number) {
    this.depth = depth
    return this
  }

  public setRelativePosition(
    backgroundCenter: Position,
    backgroundDimenstion: Dimensions,
    deltaX: number,
    deltaY: number,
  ) {
    this.position = {
      x: backgroundCenter.x - backgroundDimenstion.width / 2 + deltaX,
      y: backgroundCenter.y - backgroundDimenstion.height / 2 + deltaY,
    }
    return this
  }

  public setRelativePositionFromSprite(background: Coords & Dimensions, deltaX: number, deltaY: number) {
    this.position = {
      x: background.x - background.width + deltaX,
      y: background.y - background.height / 2 + deltaY,
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

  public getDimensions(): Dimensions {
    return {
      height: this.height,
      width: this.width,
    }
  }

  public setDimensions(dimensions: Dimensions) {
    this.height = dimensions.height
    this.width = dimensions.width
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
