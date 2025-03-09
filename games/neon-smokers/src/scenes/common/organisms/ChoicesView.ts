import {
  ActivationContainer,
  allConditionsPass, COMMON_EVENT_TYPES,
  CommonEntity,
  EffectHolder, EffectsHolder,
  EventSink,
  EventSource, LimitedNumber,
  OptionWithPreconditions,
} from '@potato-golem/core'
import { ButtonGridBuilder, PotatoContainer, type PotatoScene, StateListBuilder } from '@potato-golem/ui'
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
import { LocationDefinition } from '../../../model/definitions/zones/common/LocationDefinition'
import { choicesViewEventBus } from '../../../registries/eventEmitterRegistry'
import { LeaveLocationActivation } from '../../../model/activations/LeaveLocationActivation'

export type CardViewParams = {
}

export type ChoicesViewDependencies = {
  worldModel: WorldModel
  choicesDirector: ChoicesDirector
}

/**
 * Displays stories and locations of a zone, and potentially a location
 */
export class ChoicesView extends PotatoContainer {

  protected readonly eventBus: EventSink & EventSource<COMMON_EVENT_TYPES | 'REFRESH'>
  protected buttonGridBuilder: ButtonGridBuilder<ImageId>
  private readonly choicesDirector: ChoicesDirector;
  private readonly worldModel: WorldModel;
  private choicesContainer: Phaser.GameObjects.Container

  constructor(
    scene: PotatoScene,
    params: CardViewParams,
    dependencies: ChoicesViewDependencies
  ) {
    super(scene, {})
    this.choicesDirector = dependencies.choicesDirector
    this.worldModel = dependencies.worldModel
    this.eventBus = choicesViewEventBus

    this.x = 300
    this.y = 100
  }

  refreshChoices() {
    if (this.choicesContainer) {
      this.choicesContainer.destroy(true)
    }

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
      this.addLocation(location)
    }

    if (this.worldModel.currentLocation && this.worldModel.playerStates.restricted_movement.value === 0) {
      this.addOption({
        image: 'rocket',
        name: 'Leave',
        effects: [new LeaveLocationActivation()]
      })
    }

    this.choicesContainer = this.buttonGridBuilder.build()
  }

  init() {
    this.refreshChoices()

    this.eventBus.on('DESTROY', (entity: CommonEntity) => {
      if (entity.type === EntityTypeRegistry.DEFAULT) {
        this.destroyChildByModelId(entity.id)
      }
    })

    this.eventBus.on('REFRESH', () => {
      this.refreshChoices()
    })
  }

  addOption(option: MenuItem & EffectsHolder & OptionWithPreconditions) {
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
        const effectContainer = ActivationContainer.fromEffectList(option.effects)
        effectContainer.activateOnlySync()
      }
    })
    console.log('added button')
  }

  addLocation(option: LocationDefinition) {
    this.buttonGridBuilder.addButton(option.name, () => {
      console.log(`Clicked location ${option.name}`)
      if (allConditionsPass(option.conditionsToEnable)) {
        const effectContainer = ActivationContainer.fromEffectList(option.effects)
        effectContainer.activateOnlySync()
        this.worldModel.setLocation(option)
        this.refreshChoices()
        console.log('location changed')
      }
    })
    console.log('added location')
  }
}
