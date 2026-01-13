import { add, distance, Vec } from "./vec";

export interface Ball {
  /** Mass */
  m: number;

  /** Radius */
  r: number;

  /** Position */
  p: Vec;

  /** Velocity */
  v: Vec;

  // TODO: Mass? Spin? Z?
}

export function move(ball: Ball) {
  if (ball.v) ball.p = add(ball.p, ball.v);
}
