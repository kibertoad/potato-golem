import Phaser from 'phaser'
import Container = Phaser.GameObjects.Container
import type { Coords, IdHolder } from '@potato-golem/core'
import {
  type ClickableElementHolder,
  type PotatoScene,
  RectangularBuilder,
  type RectangularGraphicsContainer,
  SpriteBuilder,
  StateUIManager,
  TextBuilder,
  type ViewListener,
  calculateViewPosition, addOnClickActivation, BROWN, RED,
} from '@potato-golem/ui'
import type { UnitEntityModel, UnitStates } from '../../../model/entities/UnitEntityModel'
import type { WorldModel } from '../../../model/entities/WorldModel'
import type { EndTurnProcessor } from '../../../model/processors/EndTurnProcessor'
import { DepthRegistry } from '../../../model/registries/depthRegistry'
import { TILE_DIMENSIONS } from '../BoardConstants'
import { MovementProcessor } from '../processors/MovementProcessor'
import { AIProcessor } from '../processors/AIProcessor'
import { imageRegistry } from '../../../registries/imageRegistry'

export type CardViewParams = {
  model: UnitEntityModel
}

export type CardViewDependencies = {
  worldModel: WorldModel
  movementProcessor: MovementProcessor
  aiProcessor: AIProcessor
}

const textOffsetX = 0
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
  private readonly movementProcessor: MovementProcessor
  private readonly aiProcessor: AIProcessor

  getClickableElement(): ViewListener {
    return this.unitSprite
  }

  moveToTile(targetCoords: Coords) {
    const viewCoords = calculateViewPosition(targetCoords, TILE_DIMENSIONS)
    this.x = viewCoords.displayX
    this.y = viewCoords.displayY
  }

  updateLabelText() {
    this.title.setText(`${this.model.powerValue.value}`)
  }

  constructor(scene: PotatoScene, params: CardViewParams, dependencies: CardViewDependencies) {
    super(scene)

    this.isSelected = false
    this.id = params.model.id
    this.moveToTile(params.model.coords)
    this.setDepth(100)

    this.model = params.model
    this.worldModel = dependencies.worldModel
    this.movementProcessor = dependencies.movementProcessor
    this.aiProcessor = dependencies.aiProcessor

    //const resolvedImage = (this.model.powerValue.value === 5) ? imageRegistry.UNIT_5 : imageRegistry.ROCKET
    const resolvedImage = imageRegistry.UNIT_5

    //const resolvedImage = imageRegistry.

    this.unitSprite = SpriteBuilder.instance(scene)
      .setTextureKey(resolvedImage)
      .setPosition({
        x: 10,
        y: 10,
      })
      .setOrigin(0, 0)
      .setWidth(TILE_DIMENSIONS.width - 20)
      .setHeight(TILE_DIMENSIONS.height - 20)
      .setInteractive({
        draggable: false,
      })
      .setDepth(DepthRegistry.INPUT_BLOCK)
      .build()

    console.log(`unit: ${JSON.stringify(params.model)}`)

    this.title = TextBuilder.instance(scene)
      //.setRelativePositionFromBackground(this, textOffsetX, textOffsetY)
      .setPosition({
        x: 5,
        y: 5,
      })
      .setOrigin(0, 0)
      .setText(``)
      .setDisplaySize(30, 30)
      .build().value

    this.updateLabelText()

    //setEntityType(this.cardFrameSprite, EntityTypeRegistry.DEFAULT)
    //setEntityModel(this.cardFrameSprite, this.model)

    //this.add(this.cardFrameSprite)
    this.add(this.unitSprite)
    this.add(this.title)

    this.stateManager = new StateUIManager(this, this.model)
    const self = this

    if (this.model.side === 'BLUE') {
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
        },
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
      },
    })
      this.stateManager.addOnClickTransitionProcessing(this.getClickableElement())
    }

    if (this.model.side === 'RED') {
      addOnClickActivation(this.getClickableElement(), () => {
        if (this.worldModel.selectedUnit) {
          const isTurnOver = this.movementProcessor.tryToAttackUnit(this.worldModel.selectedUnit, this)
          if (isTurnOver) {
            this.aiProcessor.processTurn()
          }
        }
      })
    }

    scene.add.existing(this)

    // add onClick logic here
  }

  public enableHighlight() {
    const rectangular = RectangularBuilder.fromSprite(
      this.scene as PotatoScene,
      this.unitSprite,
      this,
    )
      .setBorderWidth(10)
      .setBaseColour(RED)
      .setDepth(DepthRegistry.HIGHLIGHT)
      .build()
    this.highlightRectangular = rectangular
    this.model.state.stateFlags.isSelected = true
  }

  public disableHighlight() {
    this.highlightRectangular.graphics.destroy(true)
    this.highlightRectangular = undefined
    this.model.state.stateFlags.isSelected = false
  }

  kill() {
    this.destroy(true)
  }

  increasePowerValue(powerValue: number) {
    this.model.powerValue.increase(powerValue)
    this.updateLabelText()
  }
}
