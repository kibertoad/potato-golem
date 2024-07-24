export type CardId = keyof typeof CardRegistry

export const CardRegistry = {
  HUMILITY: 'HUMILITY',
  ANGER: 'ANGER',
  ABSYNTHE: 'ABSYNTHE',
  MOLD: 'MOLD',
  ALEMBIC: 'ALEMBIC',
  BUNSEN_BURNER: 'BUNSEN_BURNER',
  HEALTH: 'HEALTH',
  FOOD: 'FOOD',
  POISON: 'POISON',
  GOLD: 'GOLD',
  MERCHANT: 'MERCHANT',
  MEDICINE: 'MEDICINE',
} as const
