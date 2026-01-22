import { isMoving } from "../physics/ball";
import { Table } from "../physics/table";
import { Hero } from "../types/hero";
import { isAlive, isDead } from "../types/hp";
import { Monster } from "../types/monster";
import { Pocket } from "../types/pocket";
import { Particle } from "./particle";

/** Represents everything in a playable level. */
export interface Level {
  n: number;
  hero: Hero;
  monsters: Monster[];

  // TODO: projectiles, shields, traps, etc.
  // Basically any temp items.

  table: Table;
  pockets: Pocket[];

  particles: Particle[];
}

export function anythingMoving({ hero, monsters, particles }: Level): boolean {
  if (isMoving(hero)) return true;
  if (monsters.some(isMoving)) return true;
  if (particles.some(isMoving)) return true;
  return false;
}

export function getLevelState(level: Level) {
  const moving = anythingMoving(level);
  const lost = isDead(level.hero);
  const won = !level.monsters.some(isAlive);

  return { won, lost, moving };
}
