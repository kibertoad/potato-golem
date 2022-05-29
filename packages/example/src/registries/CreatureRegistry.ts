import {
    commonCreateInstance,
    CommonEntityDescriptor,
    CommonEntityInstanceContext,
} from '@potato-golem/core'

export const creatureRegistry: Record<string, CommonEntityDescriptor<CommonEntityInstanceContext>> = {
    protagonist: {
        image: 'logo',
        typeId: 'protagonist',
        name: 'Protagonist',
        createInstance: commonCreateInstance
    }
}
