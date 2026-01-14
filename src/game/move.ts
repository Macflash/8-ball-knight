import React from "react";
import { collide, isMoving, move } from "../physics/ball";
import { GameState } from "./game";
import { playBallHit } from "../sounds/audio";

export function anythingMoving(game: GameState): boolean {
  return isMoving(game.hero) || game.monsters.some(isMoving);
}

function updateGame(game: GameState): GameState {
  const { hero, table, monsters } = game;

  // Move the hero
  move(hero);

  // Move the monsters and check for collisions with the hero
  for (const monster of monsters) {
    move(monster);
    const hit = collide(hero, monster);
    if (hit) playBallHit();
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

  return { ...game };
}

export function useGame(initialGame: GameState) {
  const [game, setGame] = React.useState(initialGame);
  const moving = anythingMoving(game);

  // Update the game physics while anything is moving.
  React.useEffect(() => {
    let valid = true;
    requestAnimationFrame(() => {
      if (!valid) return;
      setGame(updateGame);
    });
    return () => void (valid = false);
  }, [moving, game, setGame]);

  return {
    game,
    setGame, // TODO: this shouldn't be called if anything is moving??
    moving,
  };
}
