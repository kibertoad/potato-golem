import Phaser from 'phaser'
import type { ZoneViewParams } from '../../scenes/board/views/ZoneView'
import type { Zone } from '../registries/zoneRegistry'

export const zones: Record<Exclude<Zone, 'any'>, Omit<ZoneViewParams, 'scene'>> = {
  streets: {
    id: 'streets',
    name: 'streets',
    debugColor: Phaser.Display.Color.GetColor(0, 0, 255),
    stackDirection: 'left',
    spawnPoints: [
      {
        x: 2410,
        y: 340,
      },
      {
        x: 2410,
        y: 340 + 390,
      },
      {
        x: 2410,
        y: 340 + 390 * 2,
      },
    ],
    vertices: [
      { x: 2560, y: 0 },
      { x: 1282, y: 720 },
      { x: 2560, y: 1440 },
    ],
  },

  lab: {
    id: 'lab',
    name: 'lab',
    debugColor: Phaser.Display.Color.GetColor(255, 0, 255),
    stackDirection: 'up',
    spawnPoints: [
      {
        x: 680,
        y: 1275,
      },
      {
        x: 680 + 300,
        y: 1275,
      },
      {
        x: 680 + 300 * 2,
        y: 1275,
      },
      {
        x: 680 + 300 * 3,
        y: 1275,
      },
      {
        x: 680 + 300 * 4,
        y: 1275,
      },
    ],
    vertices: [
      { x: 0, y: 1440 },
      { x: 1282, y: 720 },
      { x: 2560, y: 1440 },
    ],
  },
  homunculus: {
    id: 'homunculus',
    name: 'homunculus',
    debugColor: Phaser.Display.Color.GetColor(255, 255, 0),
    stackDirection: 'left',
    spawnPoints: [
      {
        x: 150,
        y: 340,
      },
      {
        x: 150,
        y: 340 + 390,
      },
      {
        x: 150,
        y: 340 + 390 * 2,
      },
    ],
    vertices: [
      { x: 1088, y: 835 },
      { x: 1088, y: 602 },
      { x: 1285, y: 500 },
      { x: 1472, y: 612 },
      { x: 1472, y: 855 },
      { x: 1282, y: 940 },
    ],
  },

  home: {
    id: 'home',
    name: 'home',
    debugColor: Phaser.Display.Color.GetColor(0, 255, 0),
    stackDirection: 'down',
    spawnPoints: [
      {
        x: 680,
        y: 170,
      },
      {
        x: 680 + 300,
        y: 170,
      },
      {
        x: 680 + 300 * 2,
        y: 170,
      },
      {
        x: 680 + 300 * 3,
        y: 170,
      },
      {
        x: 680 + 300 * 4,
        y: 170,
      },
    ],
    vertices: [
      { x: -18, y: 0 },
      { x: 1282, y: 720 },
      { x: 2560, y: 0 },
    ],
  },

  alchemy: {
    id: 'alchemy',
    name: 'alchemy',
    stackDirection: 'right',
    spawnPoints: [
      {
        x: 150 + 300 * 2,
        y: 340 + 390,
      },
    ],
    vertices: [
      { x: 0, y: 12 },
      { x: 1282, y: 720 },
      { x: 0, y: 1440 },
    ],
  },
}
