import { TargettedMultiplexActivation } from './TargettedMultiplexActivation'
import { DynamicDescriptionHolder, DynamicDescriptionsHolder } from '../interfaces/Entities'

function isDynamicDescriptionHolder (entity: unknown): entity is DynamicDescriptionHolder {
  // @ts-ignore
  return 'getDescription' in entity
}

export class DescribedTargettedMultipleActivation<T> extends TargettedMultiplexActivation<T> implements DynamicDescriptionsHolder{

  getDescriptions(): string[] {
    const descriptions: string[] = []
    for (const activation of this.activations) {
      if (!isDynamicDescriptionHolder(activation)) {
        throw new Error('Passed entity does not implement DynamicDescriptionHolder interface')
      }

      descriptions.push(activation.getDescription())
    }
    return descriptions
  }

}
