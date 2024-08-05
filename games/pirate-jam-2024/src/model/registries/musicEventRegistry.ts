export type MusicEvent = (typeof MusicEventRegistry)[keyof typeof MusicEventRegistry]
export type MusicEventId = MusicEvent['id']
export type MusicEventParameterId<ME extends MusicEvent> = keyof ME['parameters']
export type MusicEventParameterValueId<ME extends MusicEvent> =
  keyof ME['parameters'][MusicEventParameterId<ME>]

type MusicEventRegistryType = {
  [key: string]: {
    id: string
    parameters?: {
      [key: string]: {
        [key: string]: number
      }
    }
  }
}

export const MusicEventRegistry = {
  ALL: {
    id: 'event:/Music/all',
    parameters: {
      MusicScene: {
        'Main Menu': 0,
        Board: 1,
        'Game Over': 2,
      },
    },
  },
  MAIN_MENU_THEME: {
    id: 'event:/Music/main_menu_theme',
    parameters: {},
  },
  BOARD_THEME: {
    id: 'event:/Music/board_theme',
    parameters: {},
  },
  GAME_OVER: {
    id: 'event:/Music/game_over',
    parameters: {},
  },
} as const satisfies MusicEventRegistryType
