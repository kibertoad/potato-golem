import { type Director, generateDirector } from './directorGenerator'

export function generateVps(count: number) {
  const directors: Director[] = []
  for (let i = 0; i < count; i++) {
    directors.push(generateDirector())
  }
  return directors
}
