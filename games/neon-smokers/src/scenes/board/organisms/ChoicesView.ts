import Container = Phaser.GameObjects.Container
import type { COMMON_EVENT_TYPES, CommonEntity, EventSink, EventSource } from '@potato-golem/core'
import { ButtonSquareBuilder, PotatoContainer, type PotatoScene } from '@potato-golem/ui'
import Phaser from 'phaser'
import { choiceDefinitions, ChoiceId } from '../../../model/definitions/choiceDefinitions'
import { ChoiceModel } from '../../../model/entities/ChoiceModel'
import EventEmitter = Phaser.Events.EventEmitter
import { CardView } from '../molecules/CardView'
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import { ImageId } from '../../../registries/imageRegistry'

export type CardViewParams = {
}

export type CardViewDependencies = {
}

export class ChoicesView extends PotatoContainer {

  protected readonly eventBus: EventSink & EventSource
  protected squareBuilder: ButtonSquareBuilder<ImageId>

  constructor(
    scene: PotatoScene,
    params: CardViewParams,
    dependencies: CardViewDependencies
  ) {
    super(scene, {})
    this.eventBus = new EventEmitter()

    console.log('test')

    this.x = 300
    this.y = 100
  }

  init() {
    this.squareBuilder = new ButtonSquareBuilder(this.scene, {
      textureKey: 'card_background',
      rowSize: 4,
      rowSpacingOffset: 10,

      depth: 100,
      distance: 20,
      height: 50,
      width: 300,
      orientation: 'vertical',
      hoverTint: 0x66ff7f,
      position: {
        x: 300 / 2 - 300 / 2,
        y: 450,
      },
    })
    this.addChoice(choiceDefinitions.exploreDistrict1.id)
    this.addChoice(choiceDefinitions.exploreDistrict1.id)
    this.addChoice(choiceDefinitions.exploreDistrict1.id)
    this.addChoice(choiceDefinitions.exploreDistrict1.id)
    this.addChoice(choiceDefinitions.exploreDistrict1.id)
    this.addChoice(choiceDefinitions.exploreDistrict1.id)
    this.finishChoices()

    this.eventBus.on('DESTROY', (entity: CommonEntity) => {
      if (entity.type === EntityTypeRegistry.DEFAULT) {
        this.destroyChildByModelId(entity.id)
      }
    })
  }

  finishChoices() {
    console.log('finished')
    this.squareBuilder.build()

    /*
    for (const element of con) {
      this.scene.add.existing(element)
    }

     */
  }

  addChoice(choiceId: ChoiceId) {
    const choiceModel = new ChoiceModel({
      parentEventSink: this.eventBus,
      definition: choiceDefinitions[choiceId],
    })

    this.squareBuilder.addButton(choiceModel.definition.name, () => {
      console.log(`Clicked ${choiceModel.id}`)
    })
    console.log('added button')

    /*
    const entityView = new CardView(
      this.potatoScene,
      {
        model: choiceModel,
        x: 0,
        y: 0,
      },
      {
      },
    )
    this.addChildViewObject(entityView)

     */
  }
}
