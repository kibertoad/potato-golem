import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import type { IdHolder } from '@potato-golem/core'
import {
  type Position,
  type PotatoScene,
  SpriteBuilder,
  TextBuilder,
  buildDragWithActivations,
  setEntityModel,
  setEntityType, calculateViewPosition, StateUIManager, RectangularBuilder, BROWN, RectangularGraphicsContainer,
} from '@potato-golem/ui'
import type { EntityModel } from '../../../model/entities/EntityModel'
import type { EndTurnProcessor } from '../../../model/processors/EndTurnProcessor'
import { EntityTypeRegistry } from '../../../model/registries/entityTypeRegistry'
import { imageRegistry } from '../../../registries/imageRegistry'
import { UnitEntity, UnitStates } from '../../../model/entities/UnitEntity'
import { TILE_DIMENSIONS } from '../BoardConstants'
import Rectangle = Phaser.Geom.Rectangle
import { DepthRegistry } from '../../../model/registries/depthRegistry'

export type CardViewParams = {
  model: UnitEntity
}

export type CardViewDependencies = {
  endTurnProcessor: EndTurnProcessor
}

const textOffsetX = 35
const textOffsetY = 5

export class UnitView extends Container implements IdHolder {
  /**
   * Generic frame for the card
   */
  //private readonly cardFrameSprite: Phaser.GameObjects.Sprite

  /**
   * Card-specific image for the card
   */
  private readonly unitSprite: Phaser.GameObjects.Sprite
  private highlightRectangular: RectangularGraphicsContainer

  private readonly stateManager: StateUIManager<UnitView, UnitEntity, UnitStates>

  private readonly isSelected: boolean

  /**
   * Text element with the name of the card
   */
  private readonly title: Phaser.GameObjects.Text

  id: string

  /**
   * Domain model of the card
   */
  private readonly model: EntityModel
  private readonly endTurnProcessor: EndTurnProcessor

  constructor(scene: PotatoScene, params: CardViewParams, dependencies: CardViewDependencies) {
    super(scene)

    const viewCoords = calculateViewPosition(params.model.coords, TILE_DIMENSIONS)

    this.isSelected = false
    this.id = params.model.id
    this.x = viewCoords.displayX
    this.y = viewCoords.displayY
    this.setDepth(100)

    this.model = params.model
    this.endTurnProcessor = dependencies.endTurnProcessor


    /*
    this.cardFrameSprite = SpriteBuilder.instance(scene)
      .setTextureKey(imageRegistry.ROCKET)
      .setPosition({
        x: 0,
        y: 0,
      })
      .setOrigin(0, 0)
      .setWidth(120)
      .setHeight(180)
      .build()

     */

    this.unitSprite = SpriteBuilder.instance(scene)
      .setTextureKey(imageRegistry.ROCKET)
      .setPosition({
        x: 0,
        y: 30,
      })
      .setOrigin(0, 0)
      .setWidth(TILE_DIMENSIONS.width)
      .setHeight(TILE_DIMENSIONS.height)
      .setInteractive({
        draggable: false,
      })
      .setDepth(DepthRegistry.INPUT_BLOCK)
      .build()

    console.log(`unit: ${JSON.stringify(params.model)}`)

    this.title = TextBuilder.instance(scene)
      .setRelativePositionFromBackground(this, textOffsetX, textOffsetY)
      .setOrigin(0, 0)
      .setText(`Soldier: ${params.model.powerValue.value}`)
      .setDisplaySize(15, 15)
      .build().value

    //setEntityType(this.cardFrameSprite, EntityTypeRegistry.DEFAULT)
    //setEntityModel(this.cardFrameSprite, this.model)

    //this.add(this.cardFrameSprite)
    this.add(this.unitSprite)
    this.add(this.title)

    this.stateManager = new StateUIManager(this, this.model)

    // Deselect
    this.stateManager.addTransition('onClick', {
      exclusiveLock: 'isSelected',
      conditionPredicate(view: UnitView, model: UnitEntity) {
        console.log('Check predicate for deselect')
        return model.state.stateFlags.isSelected === true
      },
      stateMutation(view: UnitView, model: UnitEntity) {
        console.log('Unit deselected')
        view.disableHighlight()
        model.state.stateFlags.isSelected = false
      }
    })

    // Select
    this.stateManager.addTransition('onClick', {
      exclusiveLock: 'isSelected',
      conditionPredicate(view: UnitView, model: UnitEntity) {
        console.log('Check predicate for select')
        return model.state.stateFlags.isSelected === false
      },
      stateMutation(view: UnitView, model: UnitEntity) {
        console.log('Unit selected')
        view.enableHighlight()
        model.state.stateFlags.isSelected = true
      }
    })

    this.stateManager.addOnClickTransitionProcessing(this.unitSprite)

    scene.add.existing(this)

    // add onClick logic here
  }

  public enableHighlight() {
    const rectangular = RectangularBuilder.fromSprite(this.scene as PotatoScene, this.unitSprite, this)
      //.setBaseColour(BROWN)
      .build()
    this.highlightRectangular = rectangular
  }

  public disableHighlight() {
    this.highlightRectangular.graphics.destroy(true)
    this.highlightRectangular = undefined
  }
}
