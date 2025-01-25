export const countryRegistry = {
  SUDAN: 'sudan',
} as const

export type CountryDefinition = {
  id: string
  name: string
}

export type CountryId = (typeof countryRegistry)[keyof typeof countryRegistry]

export const entityDefinitions = {
  sudan: {
    id: 'SUDAN',
    name: 'Sudan',
  },
} as const satisfies Record<CountryId, CountryDefinition>
