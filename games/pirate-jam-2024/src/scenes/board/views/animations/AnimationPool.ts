import Phaser from 'phaser'
import type { AnimationBase, AnimationTarget } from './AnimationBase'

export class AnimationPool<A extends typeof AnimationBase> extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, animationClass: A) {
    super(scene, {
      classType: animationClass,
      maxSize: -1,
    })
  }

  public async playAt(x: number, y: number, depth = 1000): Promise<void> {
    const animation = this.spawn()

    await animation.playAt(x, y, depth)
    this.despawn(animation)
  }

  public async playAtTarget(target: AnimationTarget): Promise<void> {
    const animation = this.spawn()
    await animation.playAtTarget(target)
    this.despawn(animation)
  }

  private spawn(): AnimationBase {
    const animation = this.get()
    animation.setVisible(true)
    animation.setActive(true)

    return animation
  }

  private despawn(animation: AnimationBase): void {
    this.killAndHide(animation)
  }
}
