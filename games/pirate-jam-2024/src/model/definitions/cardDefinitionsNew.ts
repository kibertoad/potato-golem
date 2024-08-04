import {
  AbstractTargettedActivation, AbstractTargettedAsyncActivation,
  DescribedTargettedAsyncMultiplexActivation,
  EventSink,
  ReasonedPrecondition, TargettedActivation, TargettedAsyncActivation,
  TargettedReasonedPrecondition,
} from '@potato-golem/core'
import type {
  ActivationContext,
  ActivationContextCardCombo,
  ActivationContextSingleCard,
} from '../activations/common/ActivationContext'
import type { CardId } from '../registries/cardRegistry'
import type { ImageId } from '../registries/imageRegistry'
import type { SfxId } from '../registries/sfxRegistry'
import type { Position } from '@potato-golem/ui'
import type { Zone } from '../registries/zoneRegistry'
import type { BoardSupportedEvents } from '../../scenes/board/BoardScene'
import { EventEmitters } from '../registries/eventEmitterRegistry'
import { resourceCardDefinitions } from './groups/resourceCards'

export type CardActivationDefinitionNew = {
  tooltip?: string
  preconditions?: readonly (ReasonedPrecondition | TargettedReasonedPrecondition<ActivationContext>)[]
  effect: (TargettedActivation<ActivationContext> | TargettedAsyncActivation<ActivationContext>)[]
}

export type CardActivationDefinitionNewCards = {
  tooltip?: string
  preconditions?: readonly (ReasonedPrecondition | TargettedReasonedPrecondition<ActivationContextCardCombo>)[]
  effects: (
    AbstractTargettedActivation<ActivationContextCardCombo> | AbstractTargettedAsyncActivation<ActivationContextCardCombo> |
    AbstractTargettedActivation<ActivationContextSingleCard> | AbstractTargettedAsyncActivation<ActivationContextSingleCard>
    )[]
}

export type CardPrettyEffectsDefinition = {
  activateSfx?: SfxId
  deactivateSfx?: SfxId
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

  zoneCombinationEffect?: Partial<Record<Zone, CardActivationDefinitionNew>>
  cardCombinationEffect?: Partial<Record<CardId, CardActivationDefinitionNewCards>>
}

export type CardDefinitions = typeof cardDefinitions

const eventSink: EventSink<BoardSupportedEvents> = EventEmitters.boardEventEmitter

export const cardDefinitions = {
  ...{resourceCardDefinitions}

} as const satisfies Record<CardId, CardDefinitionNew>
