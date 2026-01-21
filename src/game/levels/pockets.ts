import { width, height, BALL_RADIUS } from "../../balls";
import { Pocket } from "../types/pocket";
import { explosionPng, rockPng } from "../../images/misc";
import { vec } from "../physics/vec";
import { pocketMp3 } from "../../sounds/audio";

// TODO: don't hard code these widths/heights, isntead allow multiple table sizes & configurations.

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
  r: BALL_RADIUS,
  blocked: false,
};

export const pockets = () => [
  // Pockets
  { ...pocket, x: 0, y: 0 },
  { ...pocket, x: width, y: 0 },
  {
    ...pocket,
    x: -0.75 * BALL_RADIUS,
    y: 0.5 * height + 0.25 * BALL_RADIUS,
  },
  {
    ...pocket,
    x: width + 0.75 * BALL_RADIUS,
    y: 0.5 * height + 0.25 * BALL_RADIUS,
  },
  { ...pocket, x: 0, y: height },
  { ...pocket, x: width, y: height },
];

export function blockPockets(indices: number[]) {
  const p = pockets();
  for (const i of indices) {
    p[i].blocked = true;
  }
  return p;
}
