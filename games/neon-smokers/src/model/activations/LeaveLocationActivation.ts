import type {Activation} from "@potato-golem/core";
import { worldModel } from '../entities/WorldModel'
import { choicesViewEventBus } from '../../registries/eventEmitterRegistry'

export class LeaveLocationActivation implements Activation {
    activate(): void {
        console.log(`Left location`)
        worldModel.setLocation(undefined)
        choicesViewEventBus.emit('REFRESH')
    }
}
