import {Game} from "phaser";
import {startingScene} from "./scenes/StartingScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: undefined,
    width: 1024,
    height: 768,
    scene: startingScene
};

// For some reason this must happen in root TS file
new Game(config);

console.log("End of TS file")
