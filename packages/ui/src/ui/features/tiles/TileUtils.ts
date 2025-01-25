import type { Coords } from '@potato-golem/core'
import type { Dimensions } from '../../common/CommonUITypes'

export function calculateViewPosition(modelCoords: Coords, tileDimensions: Dimensions) {
  const displayX = (modelCoords.x - 1) * tileDimensions.width;
  const displayY = (modelCoords.y - 1) * tileDimensions.height;

  return { displayX, displayY };
}
