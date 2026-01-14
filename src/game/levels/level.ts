import { isMoving } from "../physics/ball";
import { Table } from "../physics/table";
import { Hero } from "../types/hero";
import { Monster } from "../types/monster";
import { Pocket } from "../types/pocket";

/** Represents everything in a playable level. */
export interface Level {
  hero: Hero;
  monsters: Monster[];

  // TODO: projectiles, shields, traps, etc.
  // Basically any temp items.

  table: Table;
  pockets: Pocket[];
}

export function anythingMoving({ hero, monsters }: Level): boolean {
  if (isMoving(hero)) return true;
  return monsters.some(isMoving);
}
