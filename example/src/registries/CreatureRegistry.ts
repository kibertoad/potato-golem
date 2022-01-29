import {commonCreateInstance, CommonEntityDescriptor, CommonEntityInstanceContext} from "../../../lib/spawners/Spawner";

export const creatureRegistry: Record<string, CommonEntityDescriptor<CommonEntityInstanceContext>> = {
    protagonist: {
        image: 'logo',
        typeId: 'protagonist',
        name: 'Protagonist',
        createInstance: commonCreateInstance
    }
}
