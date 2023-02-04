import { Activation, ActivationCallback } from "@potato-golem/ui";
import { AiOperationPlanner } from "../ai/AiOperationPlanner";
import { worldState } from "../model/worldState";
import { Scene } from "phaser";

export type TurnEvent = {
  name: string;
  fullText: string;
  link?: ActivationCallback;
};
export class EndTurnProcessor {
  private readonly aiOperationPlanner: AiOperationPlanner;

  constructor() {
    this.aiOperationPlanner = new AiOperationPlanner(worldState);
  }

  process() {
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
  }
}
