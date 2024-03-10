import { ActivationCallback } from "@potato-golem/core"

export type Position = {
  x: number
  y: number
}

export type ChoiceOption = {
  text: string
  activation?: ActivationCallback
}

export type ViewParent = {
  
}
