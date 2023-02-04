import { genNames } from "generate-human-names";
import { normalizedRandom, randomOneOf } from "@potato-golem/core";
import { DirectorPortraits, Gender } from "../registries/ImageRegistry";
import gaussian from "gaussian";

export type Stats = {
  speed: number;
  innovation: number;
  reliability: number;
  transparency: number;
  integrity: number;
};

export enum PerkIds {
  disciplined = "disciplined",
}

export type PerkDefinition = {};
export const Perks: Record<PerkIds, PerkDefinition> = {
  [PerkIds.disciplined]: {
    id: PerkIds,
  },
};

export type Director = {
  name: string;
  gender: Gender;
  icon: string;
  stats: Stats;
  perks: Set<PerkDefinition>;
};

export function generateDirectors(count: number) {
  const directors: Director[] = [];
  for (let i = 0; i < count; i++) {
    directors.push(generateDirector());
  }
  return directors;
}

function getValueInRange(max: number) {
  return normalizedRandom(max);
}

// 1 - 10
function generateStats(): Stats {
  return {
    innovation: getValueInRange(10),
    integrity: getValueInRange(10),
    reliability: getValueInRange(10),
    speed: getValueInRange(10),
    transparency: getValueInRange(10),
  };
}

export function generateDirector(): Director {
  const gender = randomOneOf(Object.values(Gender));
  const [name] = genNames({
    gender,
    surname: true,
    count: 1,
  });
  const icon = randomOneOf(DirectorPortraits[gender]);
  const stats = generateStats();

  const director: Director = {
    name: `${name.first} ${name.last}`,
    gender,
    stats,
    icon,
    perks: new Set(),
  };

  return director;
}
