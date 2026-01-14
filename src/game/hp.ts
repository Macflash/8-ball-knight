export interface HP {
  p: number;
  max: number;
}

export function hp(max: number): HP {
  return { p: max, max };
}

/** Damage HP without going below 0. */
export function damage(h: HP, n: number) {
  h.p = Math.max(0, h.p - n);
}

/** Heal HP without going above the max. */
export function heal(h: HP, n: number) {
  h.p = Math.max(h.max, h.p + n);
}

export function isAlive({ h }: { h: HP }): boolean {
  return h.p > 0;
}

export function isHurt({ h }: { h: HP }): boolean {
  return h.p < 0.7 * h.max;
}

export function isDead({ h }: { h: HP }): boolean {
  return h.p <= 0;
}
