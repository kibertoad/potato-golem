export interface Processor<InputType = undefined, OutputType = void> {
  process(params: InputType): OutputType
}
