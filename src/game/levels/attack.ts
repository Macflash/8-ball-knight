import { Hero } from "../types/hero";
import { Monster } from "../types/monster";
import { Level } from "./level";

export interface Attack<
  AttackerT extends Hero | Monster,
  TargetT extends Hero | Monster,
> {
  // how do we handle like... everything.
  // OK, some initial conditions.
  // and then maybe on-hit, etc.
  // would be cool to calculate damage based on speed.

  name: string;
  cost?: number;

  launch(
    charge: number,
    direction: number,
    attacker: AttackerT,
    level: Level,
  ): void;

  onHit(attacker: AttackerT, target: TargetT): void;
}

// export const BasicShot: Attack {

// }
