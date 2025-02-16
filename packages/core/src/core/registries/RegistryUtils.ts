/**
 * This returns all ids stored in an id registry
 */
export type RegistryEntityId<Registry extends Record<string, string>> = (Registry)[keyof Registry]
