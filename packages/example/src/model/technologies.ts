export type ParentTechnologyDefinition = {
  branches: Record<string, TechnologyDefinition>
} & TechnologyDefinition

export type TechnologyDefinition = {
  id: string
  name: string
  description?: string
  icon?: string
}

enum TechnologyIds {
  DRONES = 'drones',
  ANTI_AIR = 'anti-air',
  COMMUNICATIONS = 'communications',
  INFANTRY = 'infantry',
  TANKS = 'tanks',
  ARTILLERY = 'artillery'
}


export const technologies: Record<TechnologyIds, ParentTechnologyDefinition> = {
  [TechnologyIds.DRONES]: {
    id: TechnologyIds.DRONES,
    name: 'Drones',
    branches: {
      payloadSize: {
        id: 'payloadSize',
        name: 'Payload size',
      },
      aaEvasion: {
        id: 'aaEvasion',
        name: 'AA evasion',
      },
      ecmEvasion: {
        id: 'ecmEvasion',
        name: 'AA evasion',
      },
      productionCost: {
        id: 'productionCost',
        name: 'Production cost',
      },

    },
  },
  [TechnologyIds.ANTI_AIR]: {
    id: TechnologyIds.ANTI_AIR,
    name: 'Anti-air defense',
    branches: {
      antiAircraft: {
        id: 'antiAircraft',
        name: 'Anti-aircraft',
      },
      antiDrone: {
        id: 'antiDrone',
        name: 'Anti-drone',
      },
      antiRocket: {
        id: 'antiRocket',
        name: 'Anti-rocket',
      },
      productionCost: {
        id: 'productionCost',
        name: 'Production cost',
      },

    },
  },
  [TechnologyIds.COMMUNICATIONS]: {
    id: TechnologyIds.COMMUNICATIONS,
    name: 'Communications',
    branches: {
      netOps: {
        id: 'netOps',
        name: 'NetOps',
        description: 'Capabilities for accumulating and transmitting combat data in realtime',
      },
      sigInt: {
        id: 'sigInt',
        name: 'SIGINT',
        description: 'Intelligence gathering by interception of signals',
      },
      encryption: {
        id: 'encryption',
        name: 'Encryption',
        description: 'Communication channel protection from eavesdropping',
      },
      electronicWarfare: {
        id: 'electronicWarfare',
        name: 'Electronic warfare',
      },

    },
  },
  [TechnologyIds.INFANTRY]: {
    id: TechnologyIds.INFANTRY,
    name: 'Infantry',
    branches: {
      smallArms: {
        id: 'smallArms',
        name: 'Small arms',
        description: 'Individual-service kinetic projectile firearms',
      },
      heavyWeapon: {
        id: 'heavyWeapon',
        name: 'Heavy weapon',
      },
      medicalSupport: {
        id: 'medicalSupport',
        name: 'Medical support',
        description: 'Portable medical equipment',
      },
      guerillaWarfare: {
        id: 'guerillaWarfare',
        name: 'Guerilla warfare',
        description: 'Explosives, concealable weapon and other gadgets for operations behind the enemy lines.',
      },
    },
  },
  [TechnologyIds.TANKS]: {
    id: TechnologyIds.TANKS,
    name: 'Tanks',
    branches: {
      fireSystems: {
        id: 'fireSystems',
        name: 'Fire systems',
        description: 'Tank guns and turrets',
      },
      armour: {
        id: 'armour',
        name: 'Armour',
      },
      maintenanceComplexity: {
        id: 'maintenanceComplexity',
        name: 'Maintenance complexity',
        description: 'Complexity of supporting operations tank, via repairs and supplies necessary',
      },
      productionCost: {
        id: 'productionCost',
        name: 'Production cost',
      },
    },
  },
  [TechnologyIds.ARTILLERY]: {
    id: TechnologyIds.ARTILLERY,
    name: 'Artillery',
    branches: {
      targettingSystems: {
        id: 'targetingSystems',
        name: 'Targeting systems',
        description: 'Radars, targeting computers, interactive maps and other measures that assist with aiming the shots',
      },
      explosivePayload: {
        id: 'explosivePayload',
        name: 'Explosive payload',
        description: 'Payload adjustments in order to increase the firepower',
      },
      mobilitySolutions: {
        id: 'mobilitySolutions',
        name: 'Mobility solutions',
        description: `Measures for rapidly moving artillery pieces out of harm's way`,
      },
      productionCost: {
        id: 'productionCost',
        name: 'Production cost',
      },
    },
  },
}