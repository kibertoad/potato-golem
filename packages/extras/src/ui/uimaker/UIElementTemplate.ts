import { Activation } from '../activations/ActivationTypes'
import { OnClickCallback } from './ButtonBuilder'

export type UIElementTemplate = {
  text?: string
  textureKey?: string

  displaySizeX?: number
  displaySizeY?: number

  positionX?: number
  positionY?: number

  onClick?: Activation | OnClickCallback
  onHover?: Activation | OnClickCallback
  onUnhover?: Activation | OnClickCallback
}