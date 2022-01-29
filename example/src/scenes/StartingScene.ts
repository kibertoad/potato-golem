import Phaser = require("phaser");
import {CommonScene} from "../../../lib/scenes/CommonScene";
import {CommonInputHandler} from "../../../lib/input/presets/CommonInputHandler";
import {CommonMovementProcessor} from "../../../lib/movement/processors/CommonMovementProcessor";
import {InputEvent} from "../../../lib/input/InputBlock";
import {CreatureSpawner} from "../../../lib/spawners/presets/CreatureSpawner";
import {creatureRegistry} from "../registries/CreatureRegistry";
import {BulletSpawner} from "../../../lib/spawners/presets/BulletSpawner";
import {bulletRegistry} from "../registries/BulletRegistry";

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
        const creatures = []
        const creatureSpawner = new CreatureSpawner(creatures, creatureRegistry)

        const bullets = []
        const bulletSpawner = new BulletSpawner(bullets, bulletRegistry)

        const movementProcessor = new CommonMovementProcessor()
        const inputHandler = new CommonInputHandler(movementProcessor)

        /*
        const protagonist = new CommonMovableEntity(logo)
        protagonist.moveTo(400, 150)
         */
        const protagonist = creatureSpawner.spawn("protagonist", {
            scene: this,
            x: 400,
            y: 150,
        })


        inputHandler.registerCommonInputHandlers(startingSceneBlock.input, {
            agent: protagonist,
            stepSize: 2
        })
        startingSceneBlock.input.registerHandler(InputEvent.KEY_DOWN_SPACE, () => {
            console.log('firing laser')
            bulletSpawner.spawn('laser', {
                scene: this,
                x: 300,
                y: 150,
                direction: 8,
                faction: "player"
            })
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
