export type CardModelParams = {
  name: string
}

export class CardModel {
  readonly name: string


  constructor(params: CardModelParams) {
    this.name = params.name
  }
}
