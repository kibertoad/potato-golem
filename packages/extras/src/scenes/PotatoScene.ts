import { InputBlock } from '../blocks/InputBlock'

export type ImageDefinition = {
  key: string
  file: any
}

export type PotatoSceneDefinition = {
  name: string
  images: readonly ImageDefinition[]
}

export abstract class PotatoScene extends Phaser.Scene {
  protected inputBlock!: InputBlock
  private readonly definition: PotatoSceneDefinition
  constructor(definition: PotatoSceneDefinition) {
    super({})
    this.definition = definition
    console.log(`Constructed scene ${definition.name}`)
  }

  create() {
    console.log(`Creating ${this.definition.name}`)

    this.createProcessors()

    console.log(`Created ${this.definition.name}`)
  }

  abstract createProcessors()

  preload() {
    console.log(`Preloading scene ${this.definition.name}`)

    for (const image of this.definition.images) {
      this.load.image(image.key, image.file)
    }

    console.log('Preload complete.')
  }
}
