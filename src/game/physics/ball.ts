import {
  add,
  magnitude,
  distance,
  dot,
  normal,
  scale,
  subtract,
  vec,
  Vec,
} from "./vec";

export interface Ball {
  /** Mass */
  m: number;

  /** Radius */
  r: number;

  /** Position */
  p: Vec;

  /** Velocity */
  v: Vec;

  // TODO: Spin? Z?
}

export function ball(r = 1, m = 1): Ball {
  return {
    m,
    r,
    p: vec(),
    v: vec(),
  };
}

/** Moves a ball according to its velocity */
export function move(ball: Ball) {
  if (ball.v) ball.p = add(ball.p, ball.v);
}

export function isMoving(ball: Ball) {
  return magnitude(ball.v) > 0;
}

/** Collides 2 balls, updating their velocities and position accordingly */
export function collide(
  a: Ball,
  b: Ball,
  updatePosition = true,
  updateVelocities = true
): boolean {
  const d = distance(a.p, b.p);
  const overlap = a.r + b.r - d;
  if (overlap < 0) return false;

  const n = normal(a.p, b.p, d);
  if (updatePosition) undoOverlap(a, b, overlap, n);
  if (updateVelocities) swapVelocities(a, b, n);

  return true;
}

function undoOverlap(
  a: Ball,
  b: Ball,
  overlap = a.r + b.r - distance(a.p, b.p),
  n = normal(a.p, b.p)
) {
  const offset = scale(n, overlap / (a.m + b.m));

  // This assumes equal mass/diameter for it to look right.
  a.p = add(a.p, scale(offset, a.m));
  b.p = subtract(b.p, scale(offset, b.m));
}

function swapVelocities(a: Ball, b: Ball, n = normal(a.p, b.p)) {
  // Project the relative velocity onto the normal between the 2 centers
  const relativeV = subtract(a.v, b.v);
  const velAlongNormal = dot(relativeV, n);
  // Skip if balls are already going apart
  if (velAlongNormal > 0) return;

  const totalMass = a.m + b.m;
  const velUpdate = scale(n, (velAlongNormal * 2) / totalMass);
  // swap the vel components according to their mass
  a.v = subtract(a.v, scale(velUpdate, a.m));
  b.v = add(b.v, scale(velUpdate, b.m));
}
