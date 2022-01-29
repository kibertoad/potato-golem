import Phaser = require("phaser");
import {CommonScene} from "../../../lib/scenes/CommonScene";
import {CommonInputHandler} from "../../../lib/input/presets/CommonInputHandler";
import {CommonMovementProcessor} from "../../../lib/movement/processors/CommonMovementProcessor";
import {CommonMovableEntity} from "../../../lib/movement/entities/CommonMovableEntity";

const logoImg = require('../assets/img/logo.png');

class StartingScene extends Phaser.Scene {
    constructor() {
        super({});
        console.log('Construct StartingScene')
    }

    preload() {
        console.log('Preload StartingScene')
        this.load.image('logo', logoImg);
    }

    create() {
        console.log('Create StartingScene')
        const logo = this.add.image(400, 150, 'logo');

        const movementProcessor = new CommonMovementProcessor()
        const inputHandler = new CommonInputHandler(movementProcessor)
        const protagonist = new CommonMovableEntity(logo)
        protagonist.moveTo(400, 150)

        inputHandler.registerCommonInputHandlers(startingSceneBlock.input, {
            agent: protagonist,
            stepSize: 5
        })


        /*
        this.tweens.add({
            targets: logo,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });

         */


    }
}

const startingScene = new StartingScene()
const startingSceneBlock = new CommonScene(startingScene)

export {
    startingSceneBlock
}
