export enum Side {
  allied = 'allied',
  enemy = 'enemy'
}

export enum OperationType {
  'trenchWarfare' = 'trenchWarfare',
  'combinedArmsAssault' = 'combinedArmsAssault',
  'droneStrike' = 'droneStrike',
  'rocketStrike' = 'rocketStrike',
}

export type TerritoryState = {
  control: number
}

export type Operation = {
  side: Side

}

export type WorldState = {

}

export const worldState: WorldState = {

}