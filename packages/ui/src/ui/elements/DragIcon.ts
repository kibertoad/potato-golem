import type { ImageBox } from 'phaser3-rex-plugins/templates/ui/ui-components'

export type DragIconOptions<ModelType> = {
  x: number
  y: number
  height: number
  width: number
  model: ModelType
  image: any
}

export class DragIcon<ModelType> {
  public x: number
  public y: number
  public height: number
  public width: number
  public model: ModelType
  public image: ImageBox

  constructor(options: DragIconOptions<ModelType>) {
    this.x = options.x
    this.y = options.y
    this.height = options.height
    this.width = options.width
    this.model = options.model
    this.image = options.image
  }
}
