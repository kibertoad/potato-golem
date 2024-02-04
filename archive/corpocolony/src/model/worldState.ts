import { territories, TerritoryDefinition, TerritoryIds } from "./territories";
import { LimitedNumber } from "@potato-golem/core";

export enum Side {
  allied = "allied",
  enemy = "enemy",
}

export function otherSide(side: Side) {
  if (side === Side.enemy) {
    return Side.allied;
  }
  return Side.enemy;
}

export enum OperationType {
  "trenchWarfare" = "trenchWarfare",
  "combinedArmsAssault" = "combinedArmsAssault",
  "droneStrike" = "droneStrike",
  "rocketStrike" = "rocketStrike",
}

export type TerritoryStateType = {
  control: Record<Side, LimitedNumber>;
};

export class TerritoryState implements TerritoryStateType {
  definition: TerritoryDefinition;
  control: Record<Side, LimitedNumber>;

  constructor(definition: TerritoryDefinition) {
    this.control = {
      [Side.allied]: new LimitedNumber(100, 100, false),
      [Side.enemy]: new LimitedNumber(0, 100, false),
    };
    this.definition = definition;
  }

  increaseControl(side: Side, amount: number) {
    this.control[side].increase(amount);
    this.control[otherSide(side)].decrease(amount);
  }
}

export function idsToTerritories(ids: Set<TerritoryIds>) {
  return Object.values(territoriesState).filter((territory) => {
    return ids.has(territory.definition.id);
  });
}

export type TerritoriesStateType = Record<TerritoryIds, TerritoryState>;
export const territoriesState: TerritoriesStateType = {
  [TerritoryIds.RED_LEAF]: new TerritoryState(territories.redLeaf),
  [TerritoryIds.OLD_FOREST]: new TerritoryState(territories.oldForest),
  [TerritoryIds.WHITE_HILLS]: new TerritoryState(territories.whiteHills),
};

export type Operation = {
  side: Side;
  operationalCost: number;
};

export type WorldState = {
  territories: TerritoriesStateType;
};

export const worldState: WorldState = {
  territories: territoriesState,
};
