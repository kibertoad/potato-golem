import type { DescribedTargettedAsyncMultiplexActivation } from '@potato-golem/core'
import type { Precondition } from '@potato-golem/core'
import type { TargettedPrecondition, TargettedReasonedPrecondition } from '@potato-golem/core'
import type { Position } from '@potato-golem/ui'
import type { ActivationContextSingleCard } from '../activations/common/ActivationContext'
import type { CardModel } from '../entities/CardModel'
import type { CardId } from '../registries/cardRegistry'
import type { ImageId } from '../registries/imageRegistry'
import type { SfxId } from '../registries/sfxRegistry'
import type { Zone } from '../registries/zoneRegistry'

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
