import { width } from "../../balls";
import { Level } from "./level";
import { TurnStage } from "../types/turn";
import { Table } from "../physics/table";
import { vec } from "../physics/vec";
import { Knight } from "./knight";
import { goblin, orc } from "./monsters";
import { blockPockets } from "./pockets";

export function getLevel(n: number): Level {
  return {
    hero: { ...Knight, p: vec(200, 300), turn: TurnStage.aim },
    table: new Table(400, 536),

    monsters: monsters[n]?.() || [],
    pockets: pockets[n]?.() || [],
  };
}

const monsters = [
  () => [{ ...orc(), p: vec(width / 2, 100) }],

  () => [
    { ...goblin(), p: vec(width / 3, 100) },
    { ...goblin(), p: vec((width * 2) / 3, 100) },
  ],

  () => [
    { ...orc(), p: vec(width / 2, 200) },
    { ...goblin(), p: vec(width / 3, 100) },
    { ...goblin(), p: vec((width * 2) / 3, 100) },
  ],

  () => [
    { ...orc(), p: vec(width / 2, 200) },
    { ...orc(), p: vec(width / 3, 150) },
    { ...orc(), p: vec((width * 2) / 3, 150) },
    { ...goblin(), p: vec(width / 4, 100) },
    { ...goblin(), p: vec(width / 2, 100) },
    { ...goblin(), p: vec((width * 3) / 4, 100) },
  ],

  () => [
    { ...goblin(), p: vec(width / 2, 200) },
    { ...goblin(), p: vec(width / 3, 150) },
    { ...goblin(), p: vec((width * 2) / 3, 150) },
    { ...goblin(), p: vec(width / 4, 100) },
    { ...goblin(), p: vec(width / 2, 100) },
    { ...goblin(), p: vec((width * 3) / 4, 100) },
  ],
];

const pockets = [
  () => blockPockets([]),

  () => blockPockets([2, 5]),

  () => blockPockets([0, 4, 5]),

  () => blockPockets([]),

  () => blockPockets([4, 5]),
];
