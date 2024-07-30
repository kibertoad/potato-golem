export type SfxId = (typeof SfxRegistry)[keyof typeof SfxRegistry]

export const SfxRegistry = {
  CARD_1: 'card-1',
  CARD_2: 'card-2',
  CARD_3: 'card-3',
  CARD_4: 'card-4',
  BITE_1: 'bite-1',
  BITE_2: 'bite-2',
  BITE_3: 'bite-3',
  SLASH_SPLAT_1: 'slash-splat-1',
  SLASH_SPLAT_2: 'slash-splat-2',
  POOF: 'poof',
  LIGHT_UP: 'light_up',
  PUT_OUT: 'put_out',
} as const
