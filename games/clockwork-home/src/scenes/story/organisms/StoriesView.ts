import { allConditionsPass, CommonEntity, EventSink, EventSource } from '@potato-golem/core'
import { ButtonGridBuilder, PotatoContainer, type PotatoScene } from '@potato-golem/ui'
import Phaser from 'phaser'
import { district1ChoiceDefinitions } from '../../../model/definitions/zones/01_district1/district1ChoiceDefinitions'
import { ChoiceModel } from '../../../model/entities/narrative/ChoiceModel'
import EventEmitter = Phaser.Events.EventEmitter
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import type { ImageId } from '../../../registries/imageRegistry'
import { ZoneBundle } from '../../../model/definitions/zones/common/ZoneBundle'
import { district1Bundle } from '../../../model/definitions/zones/01_district1/district1Bundle'

export type CardViewParams = {
}

export type CardViewDependencies = {
}

export class StoriesView extends PotatoContainer {

  protected readonly eventBus: EventSink & EventSource
  protected buttonGridBuilder: ButtonGridBuilder<ImageId>
  protected zone: ZoneBundle

  constructor(
    scene: PotatoScene,
    params: CardViewParams,
    dependencies: CardViewDependencies
  ) {
    super(scene, {})
    this.eventBus = new EventEmitter()
    this.zone = district1Bundle

    console.log('test')

    this.x = 300
    this.y = 100
  }

  init() {
    this.buttonGridBuilder = new ButtonGridBuilder(this.scene, {
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
    this.addStory(district1ChoiceDefinitions.exploreDistrict1.id)
    this.addStory(district1ChoiceDefinitions.exploreDistrict1.id)
    this.finishChoices()

    this.eventBus.on('DESTROY', (entity: CommonEntity) => {
      if (entity.type === EntityTypeRegistry.DEFAULT) {
        this.destroyChildByModelId(entity.id)
      }
    })
  }

  finishChoices() {
    console.log('finished')
    this.buttonGridBuilder.build()

    /*
    for (const element of con) {
      this.scene.add.existing(element)
    }

     */
  }

  addStory(storyId: string) {
    const choiceModel = new ChoiceModel({
      parentEventSink: this.eventBus,
      definition: this.zone.globalChoices[storyId],
    })
    const choiceDefinition = choiceModel.definition

    this.buttonGridBuilder.addButton(choiceDefinition.name, () => {
      console.log(`Clicked ${choiceModel.id}`)
      console.log(`Definition: ${JSON.stringify(choiceDefinition)}`)
      if (allConditionsPass(choiceDefinition.conditionsToEnable)) {
        choiceDefinition.effects.activateOnlySync()
      }
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
