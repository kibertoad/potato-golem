import { Activation, ActivationCallback } from "@potato-golem/ui";
import { AiOperationPlanner } from "../ai/AiOperationPlanner";
import { worldState } from "../model/worldModel";
import { Scene } from "phaser";

export type TurnEvent = {
  name: string;
  fullText: string;
  link?: ActivationCallback;
};
export class EndTurnProcessor {

  constructor() {
  }

  process() {
    /*
    const turnEvents: TurnEvent[] = [];
    turnEvents.push({
      name: "Control lost",
      fullText: "3% control lost in Red Zone",
    });
    turnEvents.push({
      name: "Control gained",
      fullText: "7% control lost in Yellow Zone",
    });

    this.aiOperationPlanner.activate();

    return turnEvents;

     */
  }
}
