export type ImageId = (typeof imageRegistry)[keyof typeof imageRegistry]

export const imageRegistry = {
  ROCKET: 'rocket',
  TERRAIN: 'terrain',
} as const
