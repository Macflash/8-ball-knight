import { width } from "../balls";
import { cue } from "./cue";
import { goblin, orc } from "./monsters";
import { pockets, blockPockets } from "./pockets";

export function getLevel(n) {
  return [{ ...cue }, ...(levels[n]?.() || [])];
}

const levels = [
  () => [{ ...orc, x: width / 2, y: 100 }, ...blockPockets([])],

  () => [
    { ...goblin, x: width / 3, y: 100 },
    { ...goblin, x: (width * 2) / 3, y: 100 },
    ...blockPockets([2, 5]),
  ],

  () => [
    { ...orc, x: width / 2, y: 200 },
    { ...goblin, x: width / 3, y: 100 },
    { ...goblin, x: (width * 2) / 3, y: 100 },
    ...blockPockets([0, 4, 5]),
  ],

  () => [
    { ...orc, x: width / 2, y: 200 },
    { ...orc, x: width / 3, y: 150 },
    { ...orc, x: (width * 2) / 3, y: 150 },
    { ...goblin, x: width / 4, y: 100 },
    { ...goblin, x: width / 2, y: 100 },
    { ...goblin, x: (width * 3) / 4, y: 100 },
    ...blockPockets([]),
  ],

  () => [
    { ...goblin, x: width / 2, y: 200 },
    { ...goblin, x: width / 3, y: 150 },
    { ...goblin, x: (width * 2) / 3, y: 150 },
    { ...goblin, x: width / 4, y: 100 },
    { ...goblin, x: width / 2, y: 100 },
    { ...goblin, x: (width * 3) / 4, y: 100 },
    ...blockPockets([4, 5]),
  ],
];
