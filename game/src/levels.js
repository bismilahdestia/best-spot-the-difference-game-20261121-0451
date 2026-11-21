// Twin Tales — Spot the Difference: the five levels.
// One clear job: name each level, set its timer and list its differences.
// A difference is an id (matched by the scene painter), a hit circle in
// scene coordinates, and a short label shown when it is found.

import { paintHarbor, paintMarket, paintVillage, paintGarden, paintCity } from './scenes.js';

export const LEVELS = [
  {
    id: 'harbor',
    name: 'Harbor Dawn',
    subtitle: 'Gulls, sails and the old lighthouse',
    timeSeconds: 120,
    paint: paintHarbor,
    diffs: [
      { id: 'gull-extra', x: 438, y: 76, r: 26, label: 'Extra gull' },
      { id: 'lighthouse-stripe', x: 479, y: 147, r: 26, label: 'Lighthouse stripe' },
      { id: 'sail-color', x: 302, y: 280, r: 30, label: 'Sail colour' },
      { id: 'crate-missing', x: 154, y: 280, r: 26, label: 'Missing crate' },
      { id: 'fish-jump', x: 398, y: 282, r: 26, label: 'Second fish' },
    ],
  },
  {
    id: 'market',
    name: 'Night Market',
    subtitle: 'Lanterns, tea stalls and one sly cat',
    timeSeconds: 110,
    paint: paintMarket,
    diffs: [
      { id: 'lantern-color', x: 300, y: 122, r: 30, label: 'Lantern colour' },
      { id: 'star-missing', x: 214, y: 48, r: 24, label: 'Missing star' },
      { id: 'awning-stripes', x: 181, y: 201, r: 26, label: 'Awning stripes' },
      { id: 'cat-missing', x: 258, y: 292, r: 30, label: 'Missing cat' },
      { id: 'sign-letter', x: 123, y: 171, r: 26, label: 'Sign spelling' },
      { id: 'balloon-extra', x: 512, y: 128, r: 26, label: 'Extra balloon' },
    ],
  },
  {
    id: 'village',
    name: 'Snowy Village',
    subtitle: 'Smoke, snowmen and quiet windows',
    timeSeconds: 100,
    paint: paintVillage,
    diffs: [
      { id: 'snowman-scarf', x: 286, y: 282, r: 28, label: 'Snowman scarf' },
      { id: 'window-lit', x: 123, y: 263, r: 26, label: 'Dark window' },
      { id: 'pine-extra', x: 496, y: 288, r: 28, label: 'Extra pine' },
      { id: 'smoke-puffs', x: 218, y: 158, r: 26, label: 'Chimney smoke' },
      { id: 'moon-crater', x: 470, y: 84, r: 24, label: 'Moon crater' },
      { id: 'sled-missing', x: 236, y: 284, r: 26, label: 'Missing sled' },
      { id: 'chimney-count', x: 458, y: 216, r: 26, label: 'Second chimney' },
    ],
  },
  {
    id: 'garden',
    name: 'Star Garden',
    subtitle: 'Bees, frogs and a picky watering can',
    timeSeconds: 90,
    paint: paintGarden,
    diffs: [
      { id: 'flower-color', x: 96, y: 268, r: 28, label: 'Flower colour' },
      { id: 'butterfly-wings', x: 308, y: 122, r: 28, label: 'Butterfly wings' },
      { id: 'frog-missing', x: 420, y: 332, r: 28, label: 'Missing frog' },
      { id: 'mushroom-spots', x: 500, y: 252, r: 26, label: 'Mushroom spots' },
      { id: 'bee-extra', x: 452, y: 148, r: 24, label: 'Extra bee' },
      { id: 'fence-picket', x: 382, y: 182, r: 24, label: 'Missing picket' },
      { id: 'sun-rays', x: 70, y: 60, r: 30, label: 'Sun rays' },
      { id: 'can-spout', x: 219, y: 338, r: 28, label: 'Watering spout' },
    ],
  },
  {
    id: 'city',
    name: 'Clockwork City',
    subtitle: 'Gears, robots and ten tiny tricks',
    timeSeconds: 90,
    paint: paintCity,
    diffs: [
      { id: 'gear-teeth', x: 110, y: 110, r: 30, label: 'Gear teeth' },
      { id: 'clock-hands', x: 295, y: 160, r: 28, label: 'Clock hands' },
      { id: 'robot-antenna', x: 106, y: 220, r: 24, label: 'Antenna light' },
      { id: 'pipe-valve', x: 460, y: 230, r: 26, label: 'Valve wheel' },
      { id: 'window-lit', x: 305, y: 219, r: 24, label: 'Dark window' },
      { id: 'balloon-color', x: 400, y: 130, r: 28, label: 'Balloon colour' },
      { id: 'cat-tail', x: 337, y: 316, r: 26, label: 'Cat tail' },
      { id: 'chimney-smoke', x: 524, y: 252, r: 26, label: 'Chimney smoke' },
      { id: 'gear-color', x: 180, y: 70, r: 26, label: 'Brass gear' },
      { id: 'star-light', x: 285, y: 58, r: 24, label: 'Rooftop star' },
    ],
  },
];

export function totalDifferences() {
  return LEVELS.reduce((sum, level) => sum + level.diffs.length, 0);
}
