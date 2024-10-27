export type SceneId = (typeof sceneRegistry)[keyof typeof sceneRegistry]

export enum sceneRegistry {
  MAIN_MENU_SCENE = 'mainMenu',
  BOARD_SCENE = 'board',
}
