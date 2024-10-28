export type SceneId = (typeof sceneRegistry)[keyof typeof sceneRegistry]

export const sceneRegistry = {
  MAIN_MENU_SCENE: 'mainMenu',
  BOARD_SCENE: 'board',
} as const
