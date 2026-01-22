import { Level } from "./level";
import { TurnStage } from "../types/turn";
import { Table } from "../physics/table";
import { vec } from "../physics/vec";
import { Knight } from "./knight";
import { goblin, orc } from "./monsters";
import { blockPockets } from "./pockets";

const table = new Table(400, 536);

export function getLevel(n: number): Level {
  return {
    n,
    hero: { ...Knight(), p: vec(200, 300), turn: TurnStage.aim },
    table,

    monsters: monsters[n]?.() || [],
    pockets: pockets[n]?.() || [],
  };
}

const monsters = [
  () => [{ ...orc(), p: vec(table.width / 2, 100) }],

  () => [
    { ...goblin(), p: vec(table.width / 3, 100) },
    { ...goblin(), p: vec((table.width * 2) / 3, 100) },
  ],

  () => [
    { ...orc(), p: vec(table.width / 2, 200) },
    { ...goblin(), p: vec(table.width / 3, 100) },
    { ...goblin(), p: vec((table.width * 2) / 3, 100) },
  ],

  () => [
    { ...orc(), p: vec(table.width / 2, 200) },
    { ...orc(), p: vec(table.width / 3, 150) },
    { ...orc(), p: vec((table.width * 2) / 3, 150) },
    { ...goblin(), p: vec(table.width / 4, 100) },
    { ...goblin(), p: vec(table.width / 2, 100) },
    { ...goblin(), p: vec((table.width * 3) / 4, 100) },
  ],

  () => [
    { ...goblin(), p: vec(table.width / 2, 200) },
    { ...goblin(), p: vec(table.width / 3, 150) },
    { ...goblin(), p: vec((table.width * 2) / 3, 150) },
    { ...goblin(), p: vec(table.width / 4, 100) },
    { ...goblin(), p: vec(table.width / 2, 100) },
    { ...goblin(), p: vec((table.width * 3) / 4, 100) },
  ],
];

const pockets = [
  () => blockPockets(table, []),

  () => blockPockets(table, [2, 5]),

  () => blockPockets(table, [0, 4, 5]),

  () => blockPockets(table, []),

  () => blockPockets(table, [4, 5]),
];
