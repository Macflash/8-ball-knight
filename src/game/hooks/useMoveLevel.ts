import React from "react";
import { collide, isMoving, move } from "../physics/ball";
import { anythingMoving, Level } from "../levels/level";
import { playBallHit, playgoblinHurt } from "../../sounds/audio";
import { Hero } from "../types/hero";
import { Monster } from "../types/monster";
import { isAttacking, notAttacking, TurnStage } from "../types/turn";
import { damage, isDead } from "../types/hp";

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
      } else setLevel(tickLevel);
    });
    return () => void (valid = false);
  }, [moving, level, setLevel]);

  return {
    level,
    setLevel, // TODO: this shouldn't be called if anything is moving??
    moving,
  };
}

function tickLevel(level: Level): Level {
  const { hero, table, monsters } = level;

  // Move the hero
  move(hero);

  // Move the monsters and check for collisions with the hero
  for (const monster of monsters) {
    if (isDead(monster)) continue;
    move(monster);
    const hit = collide(hero, monster);
    if (hit && isAttacking(hero)) heroAttack(hero, monster);
    else if (hit) playBallHit();
  }

  // Check for collisions between the monsters
  for (let i = 0; i < monsters.length; i++) {
    for (let j = i + 1; j < monsters.length; j++) {
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
