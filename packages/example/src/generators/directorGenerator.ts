import { genNames } from 'generate-human-names'
import { randomOneOf } from '@potato-golem/core'
import { DirectorPortraits, Gender } from '../registries/ImageRegistry'

export enum PerkIds {
  disciplined =  'disciplined'
}

export type PerkDefinition = {

}
export const Perks: Record<PerkIds, PerkDefinition> = {
  [PerkIds.disciplined]: {
    id: PerkIds
  }
}

export type Director = {
  name: string
  gender: Gender
  icon: string
  perks: Set<PerkDefinition>
}

export function generateDirectors(count: number) {
  const directors: Director[] = []
  for(let i = 0; i < count; i++){
    directors.push(generateDirector())
  }
  return directors
}


export function generateDirector(): Director {
  const gender = randomOneOf(Object.values(Gender))
  const [name] = genNames({
    gender,
    surname: true,
    count: 1
  })
  const icon = randomOneOf(DirectorPortraits[gender])

  const director: Director = {
    name: `${name.first} ${name.last}`,
    gender,
    icon,
    perks: new Set()
  }

  return director
}