import { Activation, ActivationCallback } from "@potato-golem/ui";
import { Side, WorldState } from "../model/worldState";

export class SetWorldActivation implements Activation {
  private readonly worldState: WorldState;

  private constructor(worldState: WorldState) {
    this.worldState = worldState;
  }

  activate() {
    this.worldState.territories.whiteHills.increaseControl(Side.enemy, 100);
  }

  public static build(worldState: WorldState): ActivationCallback {
    const activation = new SetWorldActivation(worldState);
    return () => {
      activation.activate();
    };
  }
}
