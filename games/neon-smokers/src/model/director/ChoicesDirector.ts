import {WorldModel} from "../entities/WorldModel";
import type {Dependencies} from "../diConfig";
import {ZoneBundle} from "../definitions/zones/common/ZoneBundle";
import {LocationModel} from "../entities/narrative/LocationModel";
import {ChoiceModel} from "../entities/narrative/ChoiceModel";
import {StoryModel} from "../entities/narrative/StoryModel";
import {StoryDefinition} from "../definitions/zones/01_district1/district1StoryDefinitions";
import {LocationDefinition} from "../definitions/zones/common/LocationDefinition";
import {ChoiceDefinition} from "../definitions/zones/01_district1/district1ChoiceDefinitions";
import {OptionWithPreconditions} from "@potato-golem/core";

function isOptionShown(option: OptionWithPreconditions): boolean {
    if (!option.conditionsToShow) {
        return true
    }

    for (const precondition of option.conditionsToShow) {
        if (!precondition.isSatisfied()) return false
    }

    return true
}

export class ChoicesDirector {
    private readonly worldModel: WorldModel

    constructor({ worldModel }: Dependencies) {
        this.worldModel = worldModel;
    }

    resolveAvailableStories(zone: ZoneBundle, location?: LocationDefinition): StoryDefinition[] {
        const availableStories: StoryDefinition[] = []

        if (location) {
            const locationChoices = location.stories.filter(isOptionShown)
            availableStories.push(...locationChoices)
        }

        return availableStories
    }

    resolveAvailableLocations(zone: ZoneBundle, currentLocation: LocationDefinition): LocationDefinition[] {
        const availableLocations = Object.values(zone.zoneLocations)
          .filter((entry) => {
              return (
                (!this.worldModel.currentLocation && !entry.parentLocation) ||
                (entry.parentLocation === this.worldModel.currentLocation.id)
              )
          })
          .filter(isOptionShown)

        return availableLocations
    }
}
