import type { Precondition } from './Precondition'

export type CommonPreconditionMetadata = {
  relatedEntityId: string
}

export abstract class PreconditionWithMetadata<Metadata = CommonPreconditionMetadata> implements Precondition {
  public readonly metadata: Metadata

  constructor(metadata: Metadata) {
    this.metadata = metadata
  }

  abstract isSatisfied(): boolean
}
