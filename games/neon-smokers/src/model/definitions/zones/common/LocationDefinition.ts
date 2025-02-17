import type { ImageId } from '../../../../registries/imageRegistry'
import type { StoryDefinition } from '../01_district1/district1StoryDefinitions'

export type LocationDefinition = {
  id: string
  name: string
  image: ImageId
  stories: StoryDefinition[]
}
