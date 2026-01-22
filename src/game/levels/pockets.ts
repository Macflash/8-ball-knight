import { Pocket } from "../types/pocket";
import { explosionPng, rockPng } from "../../images/misc";
import { vec } from "../physics/vec";
import { pocketMp3 } from "../../sounds/audio";
import { Table } from "../physics/table";

// TODO: don't hard code these widths/heights, isntead allow multiple table sizes & configurations.

const pocketRadius = 40;

const pocket: Pocket = {
  pocket: true,
  images: {
    blocked: rockPng,
    explode: explosionPng,
  },
  sounds: {
    pocket: pocketMp3,
  },
  p: vec(),
  r: pocketRadius,
  blocked: false,
};

export const pockets = (table: Table) => [
  // Pockets
  { ...pocket, x: 0, y: 0 },
  { ...pocket, x: table.width, y: 0 },
  {
    ...pocket,
    x: -0.75 * pocketRadius,
    y: 0.5 * table.height + 0.25 * pocketRadius,
  },
  {
    ...pocket,
    x: table.width + 0.75 * pocketRadius,
    y: 0.5 * table.height + 0.25 * pocketRadius,
  },
  { ...pocket, x: 0, y: table.height },
  { ...pocket, x: table.width, y: table.height },
];

export function blockPockets(table: Table, indices: number[]) {
  const p = pockets(table);
  for (const i of indices) {
    p[i].blocked = true;
  }
  return p;
}
