import type { EventSink } from '@potato-golem/core'
import type { BoardSupportedEvents } from '../../../scenes/board/BoardScene'
import { EventEmitters } from '../../registries/eventEmitterRegistry'
import type { CardId } from '../../registries/cardRegistry'
import type { CardDefinitionNew } from '../cardDefinitionsNew'

const eventSink: EventSink<BoardSupportedEvents> = EventEmitters.boardEventEmitter

export const creatureCardDefinitions = {
  THE_ID: {
    id: 'THE_ID',
    image: 'the_id_card',
    name: 'The Id',
    nonDraggable: true,
  },

  SHADOW_MUSE: {
    id: 'SHADOW_MUSE',
    image: 'shadow_muse_card',
    name: 'Shadow Muse',
    nonDraggable: true,
  },

  SONECHKA: {
    id: 'SONECHKA',
    name: 'Sonechka',
    image: 'sonechka_card',
    nonDraggable: true,
  },
} as const satisfies Partial<Record<CardId, CardDefinitionNew>>
