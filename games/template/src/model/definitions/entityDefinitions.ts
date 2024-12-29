export const entityRegistry = {
  SAUSAGE: 'sausage',
} as const

export type EntityDefinition = {
  id: string
  name: string
}

export type EntityId = (typeof entityRegistry)[keyof typeof entityRegistry]

export const entityDefinitions = {
  sausage: {
    id: 'MOLDY_SAUSAGE',
    name: 'Moldy Sausage',
  },
} as const satisfies Record<EntityId, EntityDefinition>
