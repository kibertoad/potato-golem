export type ImageId = (typeof ImageRegistry)[keyof typeof ImageRegistry]

export const ImageRegistry = {
  ROCKET: 'rocket',
  BOARD_BACKGROUND: 'board_background',
  CARD_FRAME: 'card_frame',
  CARD_FRAME_DECOR: 'card_frame_decor',
  CARD_FRAME_EAT: 'card_frame_eat',
  CARD_FRAME_EAT_2: 'card_frame_eat_2',
  GLASS_PANEL: 'glass_panel',
  EVENTS_BACKGROUND: 'events_background',
  HOMUNCULUS: 'homunculus',

  // cards
  HEALTH_CARD: 'health_card',
  GOLD_CARD: 'gold_card',
  POISON_CARD: 'poison_card',
  MEDICINE_CARD: 'medicine_card',
  CORPSE_CARD: 'corpse_card',
  ALCHEMICAL_SUPPLIES_CARD: 'alchemical_supplies_card',
  BOOZE_CARD: 'booze_card',

  ROUGH_KIND_CARD: 'rough_kind_card',
  MERCHANT_CARD: 'merchant_card',
  THE_LAW_CARD: 'the_law_card',
  SHADOW_MUSE_CARD: 'shadow_muse_card',

  // explosions
  EXPLOSION_1: 'explosion_1',
  EXPLOSION_2: 'explosion_2',
  EXPLOSION_3: 'explosion_3',
  EXPLOSION_4: 'explosion_4',
  EXPLOSION_5: 'explosion_5',

  // statuses
  HOMUNCULUS_HEART: 'homunculus_heart',
  TIME: 'time',

  // animations
  CLOUD_1: 'cloud_1',
  CLOUD_2: 'cloud_2',
  CLOUD_3: 'cloud_3',
  CLOUD_4: 'cloud_4',
} as const
