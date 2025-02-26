import {Activation} from "@potato-golem/core";

export class EnterLocationActivation implements Activation {
    private readonly locationId: string

    constructor(locationId: string) {
        this.locationId = locationId
    }

    activate(): void {
        console.log(`Entered location ${this.locationId}`)
    }
}
