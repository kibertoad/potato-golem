import type { Activation } from './Activation'
import { LimitedNumber } from '../primitives/LimitedNumber'

export type QueuedActivationParams = {
  id: string
  activation: Activation
  activatesIn: number // how many time units before activation is triggered
  unique?: boolean // if true, no more than one can be queued at a time
  description?: string
}

export class QueuedActivation implements Activation {
  private activatesIn: LimitedNumber
  private readonly activation: Activation
  public readonly unique: boolean
  public readonly id: string
  public readonly description?: string

  constructor(params: QueuedActivationParams) {
    this.activatesIn = new LimitedNumber(params.activatesIn, params.activatesIn)
    this.activation = params.activation
    this.unique = params.unique ?? false
    this.id = params.id
    this.description = params.description
  }

  processTime(timeUnits: number): boolean {
    this.activatesIn.decrease(timeUnits)
    return (this.activatesIn.value <= 0)
  }

  resetTime() {
    this.activatesIn.setToMax()
  }

  activate(...args: []): void {
    console.log('AAAAA', args)
    this.activation.activate.apply(this.activation, args)
  }
}
