export type MusicId = (typeof musicRegistry)[keyof typeof musicRegistry]

export const musicRegistry = {
  MAIN_THEME: 'mainTheme',
} as const
