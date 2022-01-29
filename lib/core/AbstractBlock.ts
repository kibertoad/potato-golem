import Phaser = require("phaser");

export abstract class AbstractBlock {
    protected readonly scene: Phaser.Scene;

    protected constructor(scene: Phaser.Scene) {
        this.scene = scene
    }
}
