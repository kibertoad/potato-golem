import { ActivationCallback } from '../activations/ActivationTypes'

export type Position = {
  x: number
  y: number
}

export type ChoiceOption = {
  text: string
  activation: ActivationCallback
}