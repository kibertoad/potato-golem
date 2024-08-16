export { LimitedNumber } from './src/core/primitives/LimitedNumber'
export { getRandomNumber, randomOneOf, normalizedRandom, generateUuid } from './src/core/utils/randomUtils'
export { chunk, removeFromArrayById, removeFalsy, removeNullish } from './src/core/utils/arrayUtils'
export type { Processor, TurnProcessor, ParameterlessProcessor } from './src/core/interfaces/Processor'
export {
  executeTargettedActivation,
} from './src/core/activations/common/Activation'
export type {
  AsyncActivation,
  AsyncActivationCallback,
  Activations,
  Prioritized,
  PrioritizedActivation,
  Activation,
  ActivationCallback,
  TargettedActivationCallback,
  TargettedActivation,
  TargettedAsyncActivation,
  TargettedActivations,
  TargettedAsyncActivationCallback,
} from './src/core/activations/common/Activation'
export type { Precondition, ReasonedPrecondition, TargettedPrecondition, TargettedReasonedPrecondition } from './src/core/preconditions/Precondition'
export { isPrecondition, isTargettedPrecondition } from './src/core/preconditions/Precondition'
export { HIGH_PRIORITY, AVERAGE_PRIORITY, LOW_PRIORITY } from './src/core/activations/common/Activation'
export { sortAndFilterActivations } from './src/core/activations/utils/activationFilter'
export { ProcessorActivation } from './src/core/activations/prefabs/ProcessorActivation'
export { MultiplexActivation } from './src/core/activations/multiplex/MultiplexActivation'
export { TargettedAsyncMultiplexActivation } from './src/core/activations/multiplex/TargettedAsyncMultiplexActivation'
export { TargettedMultiplexActivation } from './src/core/activations/multiplex/TargettedMultiplexActivation'
export { DescribedTargettedAsyncMultiplexActivation } from './src/core/activations/multiplex/DescribedTargettedAsyncMultiplexActivation'
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
export { QueuedActivation, QueuedTargettedActivation, type QueuedTargettedActivationParams, type QueuedActivationParams } from './src/core/activations/prefabs/QueuedActivation'
export { ActivationContainer } from './src/core/activations/common/ActivationContainer'
export { isTargettedAsyncActivation, isTargettedActivation, isAsyncActivation, isActivation } from './src/core/activations/common/AbstractActivation'
