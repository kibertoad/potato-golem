export type Zone = (typeof zoneRegistry)[keyof typeof zoneRegistry]

export const zoneRegistry = {
  any: 'any',
  homunculus: 'homunculus',
  laboratory: 'lab',
  home: 'home',
  streets: 'streets',
  alchemy: 'alchemy',
} as const
