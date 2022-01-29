import { Game } from 'phaser';
const logoImg = require('./assets/img/logo.png');

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super({});
    }

    preload ()
    {
        this.load.image('logo', logoImg);
    }

    create ()
    {
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

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1280,
    height: 1024,
    scene: MyGame
};

const game = new Game(config);
