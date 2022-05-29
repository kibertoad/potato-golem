import Phaser = require("phaser");

//const logoImg = require('../assets/img/logo.png');

class StartingScene extends Phaser.Scene {
    constructor() {
        super({});
        console.log('Construct StartingScene')
    }

    preload() {
        console.log('Preload StartingScene')
  //      this.load.image('logo', logoImg);
    }

    create() {
        console.log('Create StartingScene')
        const logo = this.add.image(400, 150, 'logo');

        this.tweens.add({
            targets: logo,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });
    }
}

const startingScene = new StartingScene()

export {
    startingScene
}
