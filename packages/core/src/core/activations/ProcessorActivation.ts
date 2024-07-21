import { validateNotNil } from 'validation-utils'
import type { Activation, ActivationCallback, Processor } from '../../../index'

/**
 * Activation which triggers specified processor
 */
export class ProcessorActivation<ProcessorType extends Processor<InputType>, InputType = undefined>
  implements Activation
{
  private readonly processor: Processor<InputType, unknown>
  private readonly params: InputType

  public constructor(
    processor: ProcessorType,
    ...params: InputType extends undefined ? [] : [InputType]
  ) {
    this.processor = processor
    // @ts-ignore
    this.params = params
  }

  activate() {
    this.processor.process(this.params)
  }

  public static build<InputType>(
    processor: Processor<InputType, unknown>,
    params: InputType,
  ): ActivationCallback {
    validateNotNil(processor, 'processor cannot be null')
    // @ts-ignore
    const activation = new ProcessorActivation(processor, params)
    return () => {
      activation.activate()
    }
  }
}
