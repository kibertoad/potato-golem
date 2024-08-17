/**
 * Entity is capable to react to turn being over
 */
export interface TurnProcessor {
  processTurn(): void
}

/**
 * Universal interface for an entity that can execute some kind of processing on demand
 */
export interface Processor<InputType = undefined, OutputType = void> {
  process(params: InputType): OutputType
}

export interface ParameterlessProcessor<OutputType = void> {
  process(): OutputType
}
