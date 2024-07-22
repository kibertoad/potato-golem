export type ImageId = (typeof ImageRegistry)[keyof typeof ImageRegistry]

export const ImageRegistry = {
  ROCKET: 'rocket',
  BOARD_BACKGROUND: 'board_background',
  CARD_FRAME: 'card_frame',
  GLASS_PANEL: 'glass_panel',
  EVENTS_BACKGROUND: 'events_background',

  // cards
  HEALTH_CARD: 'health_card',
  GOLD_CARD: 'gold_card',
  MEDICINE_CARD: 'medicine_card',
  CORPSE_CARD: 'corpse_card',
} as const
