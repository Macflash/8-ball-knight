import React from "react";
import { anythingMoving, Level } from "../levels/level";
import { TurnStage } from "../types/turn";

/** Selects the next living monster, OR the hero. */
export function useHeroTurn(level: Level, setLevel: (level: Level) => void) {
  const moving = anythingMoving(level);
  const { hero } = level;

  React.useEffect(() => {
    if (moving) return;
    if (!hero.turn) return;

    // Do we really need "resolve" stage right now?
    if (hero.turn == TurnStage.attack || hero.turn == TurnStage.resolve) {
      if (hero.scratched) hero.scratched = false;
      else if (hero.pocketedEnemy) {
        hero.turn = TurnStage.aim;
        setLevel({ ...level });
        return;
      }

      hero.turn = TurnStage.inactive;
      setLevel({ ...level });
      return;
    }
  }, [moving, hero.turn]);

  return { hero };
}
