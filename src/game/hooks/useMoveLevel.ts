import React from "react";
import { collide, intersect, move } from "../physics/ball";
import { anythingMoving, getLevelState, Level } from "../levels/level";
import {
  playBallDrop,
  playBallHit,
  playCueHurt,
  playgoblinHurt,
} from "../../sounds/audio";
import { Hero } from "../types/hero";
import { Monster } from "../types/monster";
import { isAiming, isAttacking } from "../types/turn";
import { damage, isAlive, isDead } from "../types/hp";
import { magnitude, vec } from "../physics/vec";

export function useMoveLevel(initial: Level) {
  const [level, setLevel] = React.useState(initial);
  const moving = anythingMoving(level);

  // Update the level physics while anything is moving.
  React.useEffect(() => {
    if (!anythingMoving(level)) return;

    let valid = true;
    requestAnimationFrame(() => {
      if (!valid) return;
      if (!anythingMoving(level)) {
        // wait was something going to go here?
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
  const { hero, table, monsters, pockets } = level;
  const { won, lost } = getLevelState(level);

  // Move the hero
  if (isAlive(hero)) move(hero);

  // Move the monsters and check for collisions with the hero
  for (const monster of monsters.filter(isAlive)) {
    move(monster);

    if (isDead(hero)) continue;
    const hit = collide(hero, monster, false, false);
    if (!hit) continue;

    if (isAttacking(hero)) heroAttack(hero, monster);
    else if (isAttacking(monster)) monsterAttack(hero, monster);
    else playBallHit();

    if (isDead(hero) || isDead(monster)) continue;

    collide(hero, monster); // Do the overlap/velocity stuff.
    console.log(round(magnitude(hero.v)), round(magnitude(hero.a)));
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

  // pockets
  for (const pocket of pockets) {
    if (won || lost) continue;
    if (pocket.blocked) continue;
    if (isDead(hero)) continue;
    if (intersect(pocket, hero)) {
      damage(hero.h, 1);
      hero.v = vec();
      hero.a = vec();
      hero.p = vec(table.width / 2, table.height / 2);
      playBallDrop();

      // if you SCRATCH, you DON'T get another turn though!
      hero.scratched = true;
    }

    for (const monster of monsters) {
      if (isDead(monster)) continue;
      if (intersect(pocket, monster)) {
        monster.h.p = 0;
        playBallDrop();

        // If it is the HERO's turn, they get to keep going!
        if (isAttacking(hero)) {
          hero.pocketedEnemy = true;
        }
      }
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
