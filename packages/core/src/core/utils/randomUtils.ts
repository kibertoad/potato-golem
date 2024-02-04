function randomBoxMuller() {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random()
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) return randomBoxMuller() // resample between 0 and 1
  return num
}

export function normalizedRandom(maxValue: number) {
  return Math.floor(randomBoxMuller() * maxValue)
}

export function randomOneOf<T>(items: T[]): T {
  return items[(items.length * Math.random()) | 0]
}
