import type { Coords } from "../primitives/Coords";

/**
 * This calculates distance between two points, when only vertical or horizontal movement is allowed
 */
export function calculateManhattanDistance(
  coord1: Coords,
  coord2: Coords
): number {
  const dx = Math.abs(coord1.x - coord2.x);
  const dy = Math.abs(coord1.y - coord2.y);
  return dx + dy;
}
