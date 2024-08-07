export { LimitedNumber } from './src/core/primitives/LimitedNumber'
export { getRandomNumber, randomOneOf, normalizedRandom, generateUuid } from './src/core/utils/randomUtils'
export { chunk, removeFromArrayById, removeFalsy, removeNullish } from './src/core/utils/arrayUtils'
export type { Processor, TurnProcessor } from './src/core/interfaces/Processor'
export type {
  Prioritized,
  PrioritizedActivation,
  Activation,
  ActivationCallback,
  TargettedActivationCallback,
  TargettedActivation,
} from './src/core/activations/Activation'
export type { Precondition, TargettedPrecondition } from './src/core/preconditions/Precondition'
export { HIGH_PRIORITY, AVERAGE_PRIORITY, LOW_PRIORITY } from './src/core/activations/Activation'
export { sortAndFilterActivations } from './src/core/activations/activationFilter'
export { ProcessorActivation } from './src/core/activations/ProcessorActivation'
export { MultiplexActivation } from './src/core/activations/MultiplexActivation'
export { TargettedMultiplexActivation } from './src/core/activations/TargettedMultiplexActivation'
export { DescribedTargettedMultipleActivation } from './src/core/activations/DescribedTargettedMultipleActivation.js'
export { type Coords, type Dimensions, copyCoords } from './src/core/primitives/Coords'
export type { EntityOwner } from './src/core/interfaces/EntityOwner'
export {
  type EventSink,
  type EventSource,
  type COMMON_EVENT_TYPES,
  globalEventEmitter,
} from './src/core/messages/EventBus'
export type {
  StaticDescriptionHolder,
  DynamicDescriptionHolder,
  DynamicDescriptionsHolder,
  Destroyable,
  TypeHolder,
  HPHolder,
  IdHolder,
  EventReceiver,
  CommonView,
  CommonEntity,
} from './src/core/interfaces/Entities'
export { QueuedActivation, type QueuedActivationParams } from './src/core/activations/commonActivations'
