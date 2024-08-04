import type { TargettedActivation, TargettedAsyncActivation } from '@potato-golem/core'
import type { ActivationContextCard, ActivationContextCards } from '../common/ActivationContext'

export abstract class CardActivation implements TargettedActivation<ActivationContextCard> {
  abstract activate(context: ActivationContextCard): void

  abstract getDescription(): string
}

export abstract class CardsActivation implements TargettedActivation<ActivationContextCards> {
  abstract activate(context: ActivationContextCards): void

  abstract getDescription(): string
}

export abstract class AsyncCardActivation implements TargettedAsyncActivation<ActivationContextCard> {
  abstract activate(context: ActivationContextCard): Promise<void>

  abstract getDescription(): string
}

export abstract class AsyncCardsActivation implements TargettedActivation<ActivationContextCards> {
  abstract activate(context: ActivationContextCards): Promise<void>

  abstract getDescription(): string
}
