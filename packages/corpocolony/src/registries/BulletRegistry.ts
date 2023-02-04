import { BulletDescriptor } from "@potato-golem/extras";

export const bulletRegistry: Record<string, BulletDescriptor> = {
  laser: new BulletDescriptor("laser", "laser", "laser"),
};
