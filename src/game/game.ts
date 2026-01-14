import { Table } from "../physics/table";
import { Hero } from "./hero";
import { Monster } from "./monster";
import { Pocket } from "./pocket";

export interface GameState {
  hero: Hero;
  monsters: Monster[];

  // TODO: projectiles, shields, traps, etc.
  // Basically any temp items.

  table: Table;
  pockets: Pocket[];
}
