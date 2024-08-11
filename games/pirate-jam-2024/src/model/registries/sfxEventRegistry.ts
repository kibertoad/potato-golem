export type SfxEvent = (typeof SfxEventRegistry)[keyof typeof SfxEventRegistry]
export type SfxEventId = SfxEvent['id']

type SfxEventRegistryType = {
  [key: string]: {
    id: string
    volume: number
  }
}

export const SfxEventRegistry = {
  BITE: {
    // When a card gets bitten/eaten
    id: 'event:/Sfx/bite',
    volume: 1,
  },
  CARD: {
    // When picking up or placing a card
    id: 'event:/Sfx/card',
    volume: 0.4,
  },
  EXPLOSION: {
    // When using explosives
    id: 'event:/Sfx/explosion',
    volume: 1,
  },
  LIGHT_UP: {
    // When the workbench starts crafting
    id: 'event:/Sfx/light_up',
    volume: 0.4,
  },
  PUT_OUT: {
    // When the workbench finishes crafting
    id: 'event:/Sfx/put_out',
    volume: 0.6,
  },
  POOF: {
    // When the card disappears with a poof effect
    id: 'event:/Sfx/poof',
    volume: 1,
  },
  SLASH_SPLAT: {
    // When a card attacks
    id: 'event:/Sfx/slash_splat',
    volume: 0.6,
  },
} as const satisfies SfxEventRegistryType
