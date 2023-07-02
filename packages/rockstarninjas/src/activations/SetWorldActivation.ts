import { Activation, ActivationCallback } from "@potato-golem/ui";
import {  WorldModel } from "../model/worldModel";

export class SetWorldActivation implements Activation {
  private readonly worldState: WorldModel;

  private constructor(worldState: WorldModel) {
    this.worldState = worldState;
  }

  activate() {
    // this.worldState.territories.whiteHills.increaseControl(Side.enemy, 100);
  }

  public static build(worldState: WorldModel): ActivationCallback {
    const activation = new SetWorldActivation(worldState);
    return () => {
      activation.activate();
    };
  }
}
