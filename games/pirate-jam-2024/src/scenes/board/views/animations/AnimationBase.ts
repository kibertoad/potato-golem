import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import Transform = Phaser.GameObjects.Components.Transform
import Depth = Phaser.GameObjects.Components.Depth

export type AnimationTarget = Transform & Depth

export abstract class AnimationBase extends Container {
  private _target?: AnimationTarget = null

  constructor(scene: Phaser.Scene) {
    super(scene)
  }

  public abstract play(): Promise<void>

  private async playInternal(): Promise<void> {
    this.scene.add.existing(this)
    this.scene.events.on('update', this.update, this)
    await this.play()
    this.cleanup()
  }

  private cleanup() {
    this.setTarget(null)
    this.scene.events.off('update', this.update)
    this.scene.children.remove(this)
  }

  public async playAt(x: number, y: number, depth: number = 1000): Promise<void> {
    this.setDepth(depth)
    this.setPosition(x, y)
    await this.playInternal()
  }

  public async playAtTarget(target: AnimationTarget): Promise<void> {
    this.setTarget(target)
    await this.playInternal()
  }

  private setTarget(target?: AnimationTarget) {
    this._target = target
    this.updateFromTarget()
  }

  private updateFromTarget() {
    if (!this._target) {
      return
    }

    this.setDepth(this._target.depth + 1)
    this.setPosition(this._target.x, this._target.y)
  }

  public update() {
    if (!this._target) {
      return
    }
    this.updateFromTarget()
  }
}
