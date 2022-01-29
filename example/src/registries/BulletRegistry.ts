import {BulletDescriptor} from "../../../lib/prefabs/BulletEntity";

export const bulletRegistry: Record<string, BulletDescriptor> = {
    laser: new BulletDescriptor("laser", "laser", "laser")
}
