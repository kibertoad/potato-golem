import { TeamModel } from './teamModel'

export type WorldModel = {
  teamModel: TeamModel;
};

export const world: WorldModel = {
  teamModel: {
    qas: [],
    analysts: [],
    developers: [],
  }
}
