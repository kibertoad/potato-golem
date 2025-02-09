export type ImageId = (typeof imageRegistry)[keyof typeof imageRegistry]

export const imageRegistry = {
  ROCKET: 'rocket',
  CARD_BACKGROUND: 'card_background',
  CARD_BACKGROUND_DECOR: 'card_background_decor',
} as const
