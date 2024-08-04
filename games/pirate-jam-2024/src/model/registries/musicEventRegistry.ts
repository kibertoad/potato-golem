export type MusicEventId = (typeof MusicEventRegistry)[keyof typeof MusicEventRegistry]

export const MusicEventRegistry = {
  MAIN_MENU_THEME: 'event:/Music/main_menu_theme',
  BOARD_THEME: 'event:/Music/board_theme',
  GAME_OVER: 'event:/Music/game_over',
}
