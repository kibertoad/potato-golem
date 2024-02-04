import {
  Operation,
  Side,
  territoriesState,
  WorldState,
} from "../model/worldState";
import { ReconMode } from "../model/reconState";
import { TerritoryCalculator } from "../calculators/territoryCalculator";
import { OperationsPlannerActivation } from "./CommonAi";

export class AiReconPlanner implements OperationsPlannerActivation {
  readonly #worldState: WorldState;
  mode: ReconMode;
  private territoryCalculator: TerritoryCalculator;

  constructor(worldState: WorldState) {
    this.#worldState = worldState;
    this.territoryCalculator = new TerritoryCalculator(territoriesState);
    this.mode = ReconMode.troops;
  }

  planOperations(allowedBudget: number): Operation {
    if (this.mode === ReconMode.troops) {
      return this.troopsRecon(allowedBudget);
    }
  }

  private troopsRecon(allowedBudget: number): Operation | null {
    const eligibleTerritories =
      this.territoryCalculator.getBorderingTerritories(Side.enemy, 60, 51);

    return {
      side: Side.enemy,
      operationalCost: 5,
    };
  }
}
