import {Activation} from "@potato-golem/core";
import { worldModel } from '../entities/WorldModel'

export class EnterLocationActivation implements Activation {
    private readonly locationId: string

    constructor(locationId: string) {
        this.locationId = locationId
    }

    activate(): void {
        console.log(`Entered location ${this.locationId}`)
        throw new Error('Not implemented')
    }
}
