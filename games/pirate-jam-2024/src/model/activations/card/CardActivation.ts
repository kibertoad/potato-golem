import {
  AbstractTargettedAsyncActivation, type DynamicDescriptionHolder,
} from '@potato-golem/core'
import type { ActivationContextSingleCard, ActivationContextCardCombo } from '../common/ActivationContext'
import { AbstractTargettedActivation } from '@potato-golem/core'

export abstract class CardActivation extends AbstractTargettedActivation<ActivationContextSingleCard> implements DynamicDescriptionHolder {
  abstract getDescription(): string
}

export abstract class CardComboActivation extends AbstractTargettedActivation<ActivationContextCardCombo> implements DynamicDescriptionHolder {
  abstract getDescription(): string
}

export abstract class AsyncCardActivation extends AbstractTargettedAsyncActivation<ActivationContextSingleCard> implements DynamicDescriptionHolder {
  abstract getDescription(): string
}

export abstract class AsyncCardComboActivation extends AbstractTargettedAsyncActivation<ActivationContextCardCombo> implements DynamicDescriptionHolder {
  abstract getDescription(): string
}
