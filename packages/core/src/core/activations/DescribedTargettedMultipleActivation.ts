import { TargettedMultiplexActivation } from './TargettedMultiplexActivation'
import type { DynamicDescriptionHolder, DynamicDescriptionsHolder, StaticDescriptionHolder } from '../interfaces/Entities'

function isDynamicDescriptionHolder (entity: unknown): entity is DynamicDescriptionHolder {
  // @ts-ignore
  return 'getDescription' in entity
}

function isStaticDescriptionHolder (entity: unknown): entity is StaticDescriptionHolder {
  // @ts-ignore
  return 'description' in entity
}

export class DescribedTargettedMultipleActivation<T> extends TargettedMultiplexActivation<T> implements DynamicDescriptionsHolder{

  getDescriptions(): string[] {
    const descriptions: string[] = []
    for (const activation of this.activations) {
      if (isDynamicDescriptionHolder(activation)) {
        descriptions.push(activation.getDescription())
      } else if (isStaticDescriptionHolder(activation)) {
          descriptions.push(activation.description)
        } else {
        console.error(`Passed entity (${activation.constructor.name}) does not implement DynamicDescriptionHolder interface`)
        descriptions.push(`MISSING getDescription() for activation.constructor.name`)
      }
    }
    return descriptions
  }

}
