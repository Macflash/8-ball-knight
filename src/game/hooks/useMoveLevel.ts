import React from "react";
import { collide, move } from "../physics/ball";
import { anythingMoving, Level } from "../levels/level";
import { playBallHit, playCueHurt, playgoblinHurt } from "../../sounds/audio";
import { Hero } from "../types/hero";
import { Monster } from "../types/monster";
import { isAiming, isAttacking } from "../types/turn";
import { damage, isAlive, isDead } from "../types/hp";
import { magnitude } from "../physics/vec";

export function useMoveLevel(initial: Level) {
  const [level, setLevel] = React.useState(initial);
  const moving = anythingMoving(level);
  const aiming = isAiming(level.hero);

  // Update the level physics while anything is moving.
  React.useEffect(() => {
    if (!anythingMoving(level)) return;

    let valid = true;
    requestAnimationFrame(() => {
      if (!valid) return;
      if (!anythingMoving(level)) {
      } else setLevel(tickLevel);
    });
    return () => void (valid = false);
  }, [moving, level, setLevel]);

  return {
    level,
    setLevel,
    moving,
  };
}

function round(n: number, x: number = 10) {
  return Math.floor(n * x) / x;
}

function tickLevel(level: Level): Level {
  const { hero, table, monsters } = level;

  // Move the hero
  move(hero);

  // Move the monsters and check for collisions with the hero
  for (const monster of monsters.filter(isAlive)) {
    move(monster);
    const hit = collide(hero, monster);
    if (hit && isAttacking(hero)) heroAttack(hero, monster);
    if (hit && isAttacking(monster)) monsterAttack(hero, monster);
    else if (hit) playBallHit();

    if (hit) console.log(round(magnitude(hero.v)), round(magnitude(hero.a)));
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

  // Bound and slow the hero and monsters (and anything else moving!!)
  table.bounceBall(hero);
  table.slowBall(hero);
  monsters.forEach((m) => table.bounceBall(m));
  monsters.forEach((m) => table.slowBall(m));

  return { ...level };
}

function heroAttack(hero: Hero, monster: Monster) {
  damage(monster.h, hero.attack);
  playgoblinHurt();
}

function monsterAttack(hero: Hero, monster: Monster) {
  damage(hero.h, monster.attack);
  playCueHurt();
}
