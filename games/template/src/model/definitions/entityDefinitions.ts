export type EntityDefinition = {
  id: string
  name: string
}

export const entityDefinitions = {
  MOLDY_SAUSAGE: {
    id: 'MOLDY_SAUSAGE',
    name: 'Moldy Sausage',
  },
} as const satisfies Record<string, EntityDefinition>
