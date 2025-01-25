import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import type { Coords, IdHolder } from '@potato-golem/core'
import {
  ClickableElementHolder,
  type PotatoScene,
  RectangularBuilder,
  RectangularGraphicsContainer,
  SpriteBuilder,
  StateUIManager,
  TextBuilder,ViewListener,
  calculateViewPosition,
} from '@potato-golem/ui'
import { UnitEntityModel, UnitStates } from '../../../model/entities/UnitEntityModel'
import { WorldModel } from '../../../model/entities/WorldModel'
import type { EndTurnProcessor } from '../../../model/processors/EndTurnProcessor'
import { DepthRegistry } from '../../../model/registries/depthRegistry'
import { imageRegistry } from '../../../registries/imageRegistry'
import { TILE_DIMENSIONS } from '../BoardConstants'

export type CardViewParams = {
  model: UnitEntityModel
}

export type CardViewDependencies = {
  worldModel: WorldModel
}

const textOffsetX = 35
const textOffsetY = 5

export class UnitView extends Container implements IdHolder, ClickableElementHolder {
  /**
   * Generic frame for the card
   */
  //private readonly cardFrameSprite: Phaser.GameObjects.Sprite

  /**
   * Card-specific image for the card
   */
  private readonly unitSprite: Phaser.GameObjects.Sprite
  private highlightRectangular: RectangularGraphicsContainer

  private readonly stateManager: StateUIManager<UnitView, UnitEntityModel, UnitStates>

  private readonly isSelected: boolean

  /**
   * Text element with the name of the card
   */
  private readonly title: Phaser.GameObjects.Text

  id: string

  /**
   * Domain model of the card
   */
  public readonly model: UnitEntityModel
  private readonly endTurnProcessor: EndTurnProcessor
  private readonly worldModel: WorldModel

  getClickableElement(): ViewListener {
    return this.unitSprite
  }

  moveToTile(targetCoords: Coords) {
    const viewCoords = calculateViewPosition(targetCoords, TILE_DIMENSIONS)
    this.x = viewCoords.displayX
    this.y = viewCoords.displayY
  }

  constructor(scene: PotatoScene, params: CardViewParams, dependencies: CardViewDependencies) {
    super(scene)


    this.isSelected = false
    this.id = params.model.id
    this.moveToTile(params.model.coords)
    this.setDepth(100)

    this.model = params.model
    this.worldModel = dependencies.worldModel

    this.unitSprite = SpriteBuilder.instance(scene)
      .setTextureKey(imageRegistry.ROCKET)
      .setPosition({
        x: 0,
        y: 0,
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
    const self = this

    // Deselect
    this.stateManager.addTransition('onClick', {
      exclusiveLock: 'isSelected',
      conditionPredicate(view: UnitView, model: UnitEntityModel) {
        console.log('Check predicate for deselect')
        return model.state.stateFlags.isSelected === true
      },
      stateMutation(view: UnitView, model: UnitEntityModel) {
        console.log('Unit deselected')
        self.worldModel.unselectUnit()
      }
    })

    // Select
    this.stateManager.addTransition('onClick', {
      exclusiveLock: 'isSelected',
      conditionPredicate(view: UnitView, model: UnitEntityModel) {
        console.log('Check predicate for select')
        return model.state.stateFlags.isSelected === false
      },
      stateMutation(view: UnitView, model: UnitEntityModel) {
        console.log('Unit selected')
        self.worldModel.selectUnit(view)
      }
    })

    this.stateManager.addOnClickTransitionProcessing(this.getClickableElement())

    scene.add.existing(this)

    // add onClick logic here
  }

  public enableHighlight() {
    const rectangular = RectangularBuilder.fromSprite(this.scene as PotatoScene, this.unitSprite, this)
      .setBorderWidth(2)
      //.setBaseColour(BROWN)
      .build()
    this.highlightRectangular = rectangular
    this.model.state.stateFlags.isSelected = true
  }

  public disableHighlight() {
    this.highlightRectangular.graphics.destroy(true)
    this.highlightRectangular = undefined
    this.model.state.stateFlags.isSelected = false
  }
}
