import type {
  ReasonedPrecondition,
  TargettedActivation,
  TargettedAsyncActivation,
  TargettedReasonedPrecondition,
} from '@potato-golem/core'
import type { Position } from '@potato-golem/ui'
import type {
  ActivationContext,
  ActivationContextCardCombo,
  ActivationContextSingleCard,
} from '../activations/common/ActivationContext'
import type { CardId } from '../registries/cardRegistry'
import type { ImageId } from '../registries/imageRegistry'
import type { Zone } from '../registries/zoneRegistry'
import { SfxEvent, SfxEventId } from '../registries/sfxEventRegistry'

export type CardActivationDefinitionNew = {
  tooltip?: string
  preconditions?: readonly (
    | ReasonedPrecondition
    | TargettedReasonedPrecondition<ActivationContext>
  )[]
  effect: (TargettedActivation<ActivationContext> | TargettedAsyncActivation<ActivationContext>)[]
}
export type IdleCardActivationDefinition = CardActivationDefinitionNew & {
  timeTillTrigger: number
}
export type PossibleCardEffects = readonly (
  | TargettedActivation<ActivationContextCardCombo>
  | TargettedAsyncActivation<ActivationContextCardCombo>
  | TargettedActivation<ActivationContextSingleCard>
  | TargettedAsyncActivation<ActivationContextSingleCard>
)[]
export type CardActivationDefinitionNewCards = {
  tooltip?: string
  preconditions?: readonly (
    | ReasonedPrecondition
    | TargettedReasonedPrecondition<ActivationContextCardCombo>
  )[]
  effects: PossibleCardEffects
}
export type CardPrettyEffectsDefinition = {
  activateSfx?: SfxEvent
  deactivateSfx?: SfxEvent
  chatBubbleOrigin?: Position
  chatBubbleRightOffset?: number
  spawnPhrases?: string[]
}
export type CardDefinitionNew = {
  id: CardId
  name: string
  image?: ImageId
  activeImage?: ImageId
  nonDraggable?: boolean
  prettyEffects?: CardPrettyEffectsDefinition

  idleZoneEffect?: Partial<Record<Zone, IdleCardActivationDefinition>>
  zoneCombinationEffect?: Partial<Record<Zone, CardActivationDefinitionNew>>
  cardCombinationEffect?: Partial<Record<CardId, CardActivationDefinitionNewCards>>
}
