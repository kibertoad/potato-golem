export type SfxEvent = (typeof SfxEventRegistry)[keyof typeof SfxEventRegistry]
export type SfxEventId = SfxEvent['id']

type SfxEventRegistryType = {
  [key: string]: {
    id: string
  }
}

export const SfxEventRegistry = {
  BITE: {
    // When a card gets bitten/eaten
    id: 'event:/Sfx/bite',
  },
  CARD: {
    // When picking up or placing a card
    id: 'event:/Sfx/card',
  },
  EXPLOSION: {
    // When using explosives
    id: 'event:/Sfx/explosion',
  },
  LIGHT_UP: {
    // When the workbench starts crafting
    id: 'event:/Sfx/light_up',
  },
  PUT_OUT: {
    // When the workbench finishes crafting
    id: 'event:/Sfx/put_out',
  },
  POOF: {
    // When the card disappears with a poof effect
    id: 'event:/Sfx/poof',
  },
  SLASH_SPLAT: {
    // When a card attacks
    id: 'event:/Sfx/slash_splat',
  },
} as const satisfies SfxEventRegistryType
