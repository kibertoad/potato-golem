import Phaser = require('phaser')

export abstract class AbstractBlock {
  protected readonly scene: Phaser.Scene

  public constructor(scene: Phaser.Scene) {
    this.scene = scene
  }
}
