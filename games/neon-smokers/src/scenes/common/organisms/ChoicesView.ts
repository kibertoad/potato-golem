import {
  allConditionsPass,
  CommonEntity,
  EffectHolder,
  EventSink,
  EventSource,
  OptionWithPreconditions
} from '@potato-golem/core'
import { ButtonGridBuilder, PotatoContainer, type PotatoScene } from '@potato-golem/ui'
import Phaser from 'phaser'
import { district1ChoiceDefinitions } from '../../../model/definitions/zones/01_district1/district1ChoiceDefinitions'
import { ChoiceModel } from '../../../model/entities/narrative/ChoiceModel'
import EventEmitter = Phaser.Events.EventEmitter
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import type { ImageId } from '../../../registries/imageRegistry'
import { ZoneBundle } from '../../../model/definitions/zones/common/ZoneBundle'
import { district1Bundle } from '../../../model/definitions/zones/01_district1/district1Bundle'
import {ChoicesDirector} from "../../../model/director/ChoicesDirector";
import {WorldModel} from "../../../model/entities/WorldModel";
import {MenuItem} from "../../../model/definitions/definitionInterfaces";

export type CardViewParams = {
}

export type ChoicesViewDependencies = {
  worldModel: WorldModel
  choicesDirector: ChoicesDirector
}

export class ChoicesView extends PotatoContainer {

  protected readonly eventBus: EventSink & EventSource
  protected buttonGridBuilder: ButtonGridBuilder<ImageId>
  private readonly choicesDirector: ChoicesDirector;
  private readonly worldModel: WorldModel;

  constructor(
    scene: PotatoScene,
    params: CardViewParams,
    dependencies: ChoicesViewDependencies
  ) {
    super(scene, {})
    this.choicesDirector = dependencies.choicesDirector
    this.worldModel = dependencies.worldModel
    this.eventBus = new EventEmitter()

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

    const availableStories = this.choicesDirector.resolveAvailableStories(this.worldModel.currentZone, this.worldModel.currentLocation)

    for (const story of availableStories) {
      this.addOption(story)
    }

    const availableLocations = this.choicesDirector.resolveAvailableLocations(this.worldModel.currentZone, this.worldModel.currentLocation)

    for (const location of availableLocations) {
      this.addOption(location)
    }

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

  addOption(option: MenuItem & EffectHolder & OptionWithPreconditions) {
    /*
    const choiceModel = new ChoiceModel({
      parentEventSink: this.eventBus,
      definition: this.worldModel.currentZone.globalChoices[choiceId],
    })

     */

    this.buttonGridBuilder.addButton(option.name, () => {
      console.log(`Clicked ${option.name}`)
      //console.log(`Definition: ${JSON.stringify(choiceDefinition)}`)
      if (allConditionsPass(option.conditionsToEnable)) {
        option.effects.activateOnlySync()
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
