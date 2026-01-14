import React from "react";
import { isMoving, move } from "../physics/ball";
import { GameState } from "./game";

export function anythingMoving(game: GameState): boolean {
  return isMoving(game.hero) || game.monsters.some(isMoving);
}

function updateGame(game: GameState): GameState {
  move(game.hero);
  game.table.slowBall(game.hero);
  game.table.bounceBall(game.hero);

  // TODO: support monsters, collisions, etc.

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
