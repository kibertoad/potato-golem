import { Game } from "phaser";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { OverviewScene } from './scenes/OverviewScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: undefined,
  width: 1024,
  height: 768,
  scene: [new MainMenuScene(), new OverviewScene()],
};

// For some reason this must happen in root TS file
new Game(config);

console.log("End of TS file");
