export type ImageId = (typeof ImageRegistry)[keyof typeof ImageRegistry]

export const ImageRegistry = {
  ROCKET: 'rocket',
}
