import {
  playBallHit,
  playboom,
  playCueHurt,
  playgoblinHurt,
  playswing,
} from "../../sounds/audio";
import { Level } from "../levels/level";
import { particle } from "../levels/particle";
import { move, collide } from "../physics/ball";
import { at, magnitude } from "../physics/vec";
import { Hero } from "../types/hero";
import { damage, isAlive, isDead } from "../types/hp";
import { Monster } from "../types/monster";
import { isAttacking } from "../types/turn";

export function tickMonsters(level: Level) {
  const { hero, monsters } = level;

  // Move the monsters and check for collisions with the hero
  for (const monster of monsters.filter(isAlive)) {
    move(monster);

    if (isDead(hero)) continue;

    const hit = collide(hero, monster, false, false);
    if (!hit) continue;

    // Do attack stuff on hit
    if (isAttacking(hero)) heroAttack(hero, monster);
    else if (isAttacking(monster)) monsterAttack(hero, monster);
    else playBallHit();

    // Check if the attacks killed either of 'em
    if (isDead(hero)) {
      playboom();
      level.particles.push(particle({ p: at(hero.p) }));
      continue;
    } else if (isDead(monster)) {
      playboom();
      level.particles.push(particle({ p: at(monster.p) }));
      continue;
    }

    // Do the overlap/velocity stuff.
    collide(hero, monster);
  }

  // Check for collisions between the monsters
  for (let i = 0; i < monsters.length; i++) {
    if (isDead(monsters[i])) continue;
    for (let j = i + 1; j < monsters.length; j++) {
      if (isDead(monsters[j])) continue;
      const hit = collide(monsters[i], monsters[j]);
      if (hit) playBallHit();
    }
  }
}

function heroAttack(hero: Hero, monster: Monster) {
  damage(monster.h, hero.attack);
  if (isDead(monster)) return;
  playswing();
  playgoblinHurt();
}

function monsterAttack(hero: Hero, monster: Monster) {
  damage(hero.h, monster.attack);
  if (isDead(hero)) return;
  playCueHurt();
}

function round(n: number, x: number = 10) {
  return Math.floor(n * x) / x;
}
