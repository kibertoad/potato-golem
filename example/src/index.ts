import { startingSceneBlock } from "./scenes/StartingScene";
import {Game} from "phaser";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: undefined,
    width: 1024,
    height: 768,
    scene: startingSceneBlock.getScene()
};

// For some reason this must happen in root TS file
new Game(config);

console.log("End of TS file")
