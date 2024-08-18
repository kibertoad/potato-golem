import type {
  DynamicDescriptionHolder,
  TargettedActivation,
  TargettedAsyncActivation,
} from '@potato-golem/core'
import type {
  ActivationContextCardCombo,
  ActivationContextCardOrEvent,
  ActivationContextSingleCard,
} from '../common/ActivationContext'

export abstract class CardActivation
  implements TargettedActivation<ActivationContextSingleCard>, DynamicDescriptionHolder
{
  abstract activateTargetted(target: ActivationContextSingleCard): void
  abstract getDescription(): string
}

export abstract class CardOrEventActivation
  implements TargettedActivation<ActivationContextCardOrEvent>, DynamicDescriptionHolder
{
  abstract activateTargetted(target: ActivationContextCardOrEvent): void
  abstract getDescription(): string
}

export abstract class CardComboActivation
  implements TargettedActivation<ActivationContextCardCombo>, DynamicDescriptionHolder
{
  abstract activateTargetted(target: ActivationContextSingleCard): void
  abstract getDescription(): string
}

export abstract class AsyncCardActivation
  implements TargettedAsyncActivation<ActivationContextSingleCard>, DynamicDescriptionHolder
{
  abstract activateTargettedAsync(target: ActivationContextSingleCard): Promise<void>
  abstract getDescription(): string
}

export abstract class AsyncCardOrEventActivation
  implements TargettedAsyncActivation<ActivationContextCardOrEvent>, DynamicDescriptionHolder
{
  abstract activateTargettedAsync(target: ActivationContextCardOrEvent): Promise<void>
  abstract getDescription(): string
}

export abstract class AsyncCardComboActivation
  implements TargettedAsyncActivation<ActivationContextCardCombo>, DynamicDescriptionHolder
{
  abstract activateTargettedAsync(target: ActivationContextSingleCard): Promise<void>
  abstract getDescription(): string
}
