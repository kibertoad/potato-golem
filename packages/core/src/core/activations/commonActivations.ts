import type { Activation } from './Activation'

export type QueuedActivationParams = {
  id: string
  activation: Activation
  activatesIn: number // how many time units before activation is triggered
  unique?: boolean // if true, no more than one can be queued at a time
  description?: string
}

export class QueuedActivation implements Activation {
  private activatesIn: number
  private readonly activation: Activation
  public readonly unique: boolean
  public readonly id: string
  public readonly description?: string

  constructor(params: QueuedActivationParams) {
    this.activatesIn = params.activatesIn
    this.activation = params.activation
    this.unique = params.unique ?? false
    this.id = params.id
    this.description = params.description
  }

  processTime(timeUnits: number): boolean {
    this.activatesIn -= timeUnits
    return (this.activatesIn <= 0)
  }

  activate() {
    this.activation.activate()
  }
}
