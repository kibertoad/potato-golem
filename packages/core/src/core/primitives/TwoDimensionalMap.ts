import type { Coords } from './Coords'

export class TwoDimensionalMap<T> {
  private map: Map<number, Map<number, T>>;

  constructor() {
    this.map = new Map<number, Map<number, T>>();
  }

  // Store an object at the specified x and y coordinates
  set(x: number, y: number, value: T): void {
    if (!this.map.has(x)) {
      this.map.set(x, new Map<number, T>());
    }
    this.map.get(x)!.set(y, value);
  }

  // Retrieve an object at the specified x and y coordinates
  get(x: number, y: number): T | undefined {
    return this.map.get(x)?.get(y);
  }

  getByCoords(coords: Coords): T | undefined {
    return this.get(coords.x, coords.y)
  }

  // Check if a value exists at the specified x and y coordinates
  has(x: number, y: number): boolean {
    return this.map.has(x) && this.map.get(x)!.has(y);
  }

  // Remove an object at the specified x and y coordinates
  delete(x: number, y: number): boolean {
    if (!this.map.has(x)) return false;
    const row = this.map.get(x)!;
    const deleted = row.delete(y);
    if (row.size === 0) {
      this.map.delete(x); // Clean up empty rows
    }
    return deleted;
  }

  // Clear the entire map
  clear(): void {
    this.map.clear();
  }

  // Get all entries in the map
  entries(): Array<{ x: number; y: number; value: T }> {
    const result: Array<{ x: number; y: number; value: T }> = [];
    for (const [x, row] of this.map.entries()) {
      for (const [y, value] of row.entries()) {
        result.push({ x, y, value });
      }
    }
    return result;
  }

  setByCoords(coords: Coords, value: T) {
    this.set(coords.x, coords.y, value)
  }
}
