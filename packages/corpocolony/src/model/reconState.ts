import { LimitedNumber } from "@potato-golem/core";

export enum ReconMode {
  infrastructure = "infrastructure",
  antiair = "antiair",
  artillery = "artillery",
  troops = "troops",
}

export class ReconState {
  intel: Record<ReconMode, LimitedNumber>;

  constructor() {
    this.intel = {
      [ReconMode.antiair]: new LimitedNumber(0, 100),
      [ReconMode.artillery]: new LimitedNumber(0, 100),
      [ReconMode.infrastructure]: new LimitedNumber(0, 100),
      [ReconMode.troops]: new LimitedNumber(0, 100),
    };
  }
}
