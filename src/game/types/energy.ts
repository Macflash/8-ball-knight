import { hp, HP } from "./hp";

export interface Energy extends HP {}

export function hasEnoughEnergy({ e }: { e: Energy }, n: number) {
  return e.p >= n;
}

export const energy = hp;
