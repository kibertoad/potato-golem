export type ImageId = (typeof imageRegistry)[keyof typeof imageRegistry]

export const imageRegistry = {
  ROCKET: 'rocket',
  TERRAIN: 'terrain',
  UNIT_5: '5',
} as const
