import {
  DescribedTargettedAsyncMultiplexActivation,
  type EventSink,
  TargettedMultiplexActivation,
} from '@potato-golem/core'
import type { Precondition } from '@potato-golem/core'
import type { TargettedPrecondition, TargettedReasonedPrecondition } from '@potato-golem/core'
import type { Position } from '@potato-golem/ui'
import type { BoardSupportedEvents } from '../../scenes/board/BoardScene'
import {
  AnimateCardActivation,
  AnimateZoneCardsActivation,
  AttackHomunculusCardActivation,
  CancelDragCardActivation,
  ChatCardActivation,
  DamageActivation,
  DecomposeBothCardsActivation,
  DecomposeCardActivation,
  DecomposeOtherCardActivation,
  DestroyCardActivation,
  DestroyZoneCardsActivation,
  EatCardActivation,
  FeedActivation,
  GainHatredActivation,
  GainHealthActivation,
  LawIsDeadActivation,
  MoveToZoneCardActivation,
  NextTurnActivation,
  QueueActivation,
  SearchAndDecideCardActivation,
  SearchAndDestroyCardActivation,
  SetActiveCardActivation,
  StartEventActivation,
  TheLawMoveActivation,
} from '../activations/card/cardActivations'
import { SpawnCardActivation } from '../activations/event/extraEventActivations'
import type { CardModel } from '../entities/CardModel'
import { CheckIfActiveCardPrecondition } from '../preconditions/CheckIfActiveCardPrecondition'
import { CombinedZonePrecondition } from '../preconditions/CombinedZonePrecondition'
import { RoughKindPrecondition } from '../preconditions/RoughKindPrecondition'
import type { CardId } from '../registries/cardRegistry'
import { EventEmitters } from '../registries/eventEmitterRegistry'
import type { ImageId } from '../registries/imageRegistry'
import type { SfxId } from '../registries/sfxRegistry'
import type { Zone } from '../registries/zoneRegistry'
import { worldModel } from '../state/WorldModel'
import { QueuedTargettedActivation } from '@potato-golem/core'
import type { ActivationContextSingleCard } from '../activations/common/ActivationContext'

export type CardEffectDefinition = {
  timeTillTrigger: number
  tooltip?: string
  preconditions?: Array<
    Precondition | TargettedPrecondition<CardModel> | TargettedReasonedPrecondition<CardModel>
  >
  effect: DescribedTargettedAsyncMultiplexActivation<ActivationContextSingleCard>
}

export type CardDefinition = {
  id: CardId
  name: string
  image?: ImageId
  activeImage?: ImageId
  activateSfx?: SfxId
  deactivateSfx?: SfxId
  nonDraggable?: boolean
  chatBubbleOrigin?: Position
  chatBubbleRightOffset?: number
  spawnPhrases?: string[]

  // Effect that is triggered after card staying within a zone for a while
  idleZoneEffect?: Partial<Record<Zone, CardEffectDefinition>>

  cardCombinationEffect?: Partial<Record<CardId, CardEffectDefinition>>
}

export type CardDefinitions = typeof cardDefinitions

const eventSink: EventSink<BoardSupportedEvents> = EventEmitters.boardEventEmitter

export const cardDefinitions = {
  // People




} as const satisfies Record<CardId, CardDefinition>
