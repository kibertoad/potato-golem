export type ImageId = (typeof imageRegistry)[keyof typeof imageRegistry]

export const imageRegistry = {
  ROCKET: 'rocket',
  TERRAIN: 'terrain',
  BLUE_OVERLAY: 'violet',
  RED_OVERLAY: 'red',
  UNIT_5: '5',
} as const
