import { fromCueAngle, scale, add } from "../physics/vec";
import { Hero } from "../types/hero";
import { Monster } from "../types/monster";
import { isAiming, TurnStage } from "../types/turn";
import { Level } from "./level";

export interface CueAttack {
  // how do we handle like... everything.
  // OK, some initial conditions.
  // and then maybe on-hit, etc.
  // would be cool to calculate damage based on speed.

  name: string;
  cost?: number;

  bonusDamage?: number;
  roll?: number;
  spin?: number;
  extraSpeed?: number;

  onHit?: (level: Level, hit: Monster) => void;
}

export const BasicAttack: CueAttack = {
  name: "Normal",
  roll: 1,
};

export const PowerAttack: CueAttack = {
  ...BasicAttack,
  name: "Strong",
  cost: 2,
  bonusDamage: 1,
};

export const ForwardRoll: CueAttack = {
  name: "Rolling Shot",
  cost: 1,
  roll: 1.5,
};

export const Charge: CueAttack = {
  name: "Charge!",
  cost: 2,
  bonusDamage: 1,
  roll: 2,
  extraSpeed: 1.25,
};

export const HookLeft: CueAttack = {
  name: "Left Hook",
  cost: 2,
  spin: -2,
};

export const HookRight: CueAttack = {
  name: "Right Hook",
  cost: 2,
  spin: 2,
};

export const BackSpin: CueAttack = {
  name: "Back spin",
  cost: 2,
  roll: -1,
  extraSpeed: 1.75,
};

export function CueShot(
  hero: Hero,
  cueStick: { aimDir: number; charge: number },
  attack: CueAttack,
) {
  if (!isAiming(hero)) return;

  hero.turn = TurnStage.attack;

  const vel =
    hero.maxSpeed * (cueStick.charge + 0.25) * (attack.extraSpeed || 1);
  hero.v = fromCueAngle(cueStick.aimDir, vel);

  hero.activeAttack = attack;
  const { roll, spin } = attack;

  if (roll) hero.a = scale(hero.v, roll);

  if (spin) {
    hero.a = add(
      hero.a,
      fromCueAngle(cueStick.aimDir + Math.sign(spin) * 90, vel * spin),
    );
  }
}
