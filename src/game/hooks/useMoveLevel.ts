import React from "react";
import { collide, intersect, move } from "../physics/ball";
import { anythingMoving, getLevelState, Level } from "../levels/level";
import {
  playBallDrop,
  playBallHit,
  playboom,
  playCueHurt,
  playgoblinHurt,
  playlost,
  playScratch,
  playswing,
  playvictory,
} from "../../sounds/audio";
import { Hero } from "../types/hero";
import { Monster } from "../types/monster";
import { isAiming, isAttacking, TurnStage } from "../types/turn";
import { damage, isAlive, isDead } from "../types/hp";
import { at, magnitude, vec } from "../physics/vec";
import { particle } from "../levels/particle";
import { pocketTick } from "../tick/pocket_tick";
import { tickMonsters } from "../tick/monster_tick";

export function useMoveLevel(initial: Level) {
  const [level, setLevel] = React.useState(initial);
  const moving = anythingMoving(level);

  // Update the level physics while anything is moving.
  React.useEffect(() => {
    if (!anythingMoving(level)) return;

    let valid = true;
    // YUCK this sucks when deployed for some reason.
    setTimeout(() => {
      if (!valid) return;
      if (!anythingMoving(level)) {
        // wait was something going to go here?
      } else setLevel(tickLevel);
    }, 5);
    return () => void (valid = false);
  }, [moving, level, setLevel]);

  return {
    level,
    setLevel,
    moving,
  };
}

function tickLevel(level: Level): Level {
  const { hero, table, monsters, pockets, particles } = level;
  const { won, lost } = getLevelState(level);

  // Hero
  if (isAlive(hero)) move(hero);

  // Monster moves and collisions
  tickMonsters(level);

  // pockets
  pocketTick(level);

  // Particles
  level.particles = particles.filter((p) => --p.lifespan > 0);

  // Table
  table.bounceBall(hero);
  table.slowBall(hero);
  monsters.forEach((m) => table.bounceBall(m));
  monsters.forEach((m) => table.slowBall(m));

  // Win conditions
  const post = getLevelState(level);
  if (post.won !== won) playvictory();
  if (post.lost !== lost) playlost();

  return { ...level };
}
