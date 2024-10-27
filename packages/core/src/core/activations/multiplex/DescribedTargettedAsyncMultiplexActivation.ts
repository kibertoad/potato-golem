import type {
  DynamicDescriptionHolder,
  DynamicDescriptionsHolder,
  StaticDescriptionHolder,
} from '../../interfaces/Entities'
import { TargettedAsyncMultiplexActivation } from './TargettedAsyncMultiplexActivation'

function isDynamicDescriptionHolder(entity: unknown): entity is DynamicDescriptionHolder {
  return 'getDescription' in (entity as DynamicDescriptionHolder)
}

function isStaticDescriptionHolder(entity: unknown): entity is StaticDescriptionHolder {
  return 'description' in (entity as StaticDescriptionHolder)
}

export class DescribedTargettedAsyncMultiplexActivation<T>
  extends TargettedAsyncMultiplexActivation<T>
  implements DynamicDescriptionsHolder
{
  getDescriptions(): string[] {
    const descriptions: string[] = []
    for (const activation of this.activations.getAllActivations()) {
      if (isDynamicDescriptionHolder(activation)) {
        descriptions.push(activation.getDescription())
      } else if (isStaticDescriptionHolder(activation)) {
        descriptions.push(activation.description)
      } else {
        console.error(
          `Passed entity (${activation.constructor.name}) does not implement DynamicDescriptionHolder interface`,
        )
        descriptions.push(`MISSING getDescription() for activation.constructor.name`)
      }
    }
    return descriptions
  }
}
