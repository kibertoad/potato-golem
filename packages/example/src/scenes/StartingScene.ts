import {
  CommonInputHandler,
  CommonMovableEntity,
  CommonMovementProcessor, CreatureSpawner,
  InputBlock,
  PotatoScene,
} from '@potato-golem/core'
import { creatureRegistry } from '../registries/CreatureRegistry'

const logoImg = require('../../assets/img/logo.png')

class StartingScene extends PotatoScene {
  private inputHandler!: CommonInputHandler

  createProcessors() {
    const movementProcessor = new CommonMovementProcessor()
    this.inputHandler = new CommonInputHandler(movementProcessor)
    this.inputBlock = new InputBlock(this)

    this.inputHandler.registerCommonInputHandlers(this.inputBlock, {
      stepSize: 2
    })
  }

  create() {
    super.create()

    const creatures = []
    const creatureSpawner = new CreatureSpawner(creatures, creatureRegistry)

    const protagonist = creatureSpawner.spawn("protagonist", {
      scene: this,
      x: 400,
      y: 150,
    })

    protagonist.moveTo(400, 150)
    this.inputHandler.setAgent(protagonist)

    /*
    const logo = this.add.image(400, 150, 'logo')

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1,
    })

     */
  }
}

const startingScene = new StartingScene({
  name: 'StartingScene',
  images: [
    {
      key: 'logo',
      file: logoImg,
    },
  ],
})

export {
  startingScene,
}
