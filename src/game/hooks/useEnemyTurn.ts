import React from "react";
import { anythingMoving, Level } from "../levels/level";
import { isAlive, isDead } from "../types/hp";
import { TurnStage } from "../types/turn";

/** Selects the next living monster, OR the hero. */
export function useActiveMonster(
  level: Level,
  setLevel: (level: Level) => void
) {
  const moving = anythingMoving(level);

  const { monsters, hero } = level;
  const activeMonster = monsters.find(({ turn }) => turn);

  React.useEffect(() => {
    if (moving) return;
    if (hero.turn) return;

    if (
      !activeMonster ||
      isDead(activeMonster) ||
      activeMonster.turn == TurnStage.attack ||
      activeMonster.turn == TurnStage.resolve
    ) {
      if (activeMonster) activeMonster.turn = TurnStage.inactive;
      const activeIndex = activeMonster ? monsters.indexOf(activeMonster) : -1;
      const nextMonster = monsters[activeIndex + 1];

      if (nextMonster?.monster) {
        nextMonster.turn = TurnStage.aim;
      } else if (isAlive(hero)) {
        hero.turn = TurnStage.aim;
      }

      setLevel({ ...level });
      return;
    }
  }, [moving, activeMonster, hero.turn]);

  return { activeMonster };
}
