export type CardId = keyof typeof CardRegistry

export const CardRegistry = {
  WORKBENCH: 'WORKBENCH',
  ABSINTHE: 'ABSINTHE',
  MOLD: 'MOLD',
  CORPSE: 'CORPSE',
  HEALTH: 'HEALTH',
  FOOD: 'FOOD',
  POISON: 'POISON',
  ALCHEMICAL_SUPPLIES: 'ALCHEMICAL_SUPPLIES',
  MONEY: 'MONEY',
  GOLD: 'GOLD',
  MERCHANT: 'MERCHANT',
  MEDICINE: 'MEDICINE',
  PORTAL: 'PORTAL',
  THE_ID: 'THE_ID',
  SINGING_MUSHROOMS: 'SINGING_MUSHROOMS',
  WATCHING_FLOWER: 'WATCHING_FLOWER',
  ENLIGHTENED_MANDRAKE: 'ENLIGHTENED_MANDRAKE',
  SHADOW_MUSE: 'SHADOW_MUSE',
  SONECHKA: 'SONECHKA',
  DAYDREAM: 'DAYDREAM',
  BLACK_WIDOW: 'BLACK_WIDOW',
  SURGEON: 'SURGEON',
  THE_RAID: 'THE_RAID',
  THE_LAW: 'THE_LAW',
  THE_ROUGH_KIND: 'THE_ROUGH_KIND',
  EXPLOSIVES: 'EXPLOSIVES',
} as const
