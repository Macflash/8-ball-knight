import React from "react";
import { anythingMoving, getLevelState, Level } from "../levels/level";
import { isAlive, isDead } from "../types/hp";
import { TurnStage } from "../types/turn";
import { playgoblinTurn } from "../../sounds/audio";

/** Selects the next living monster, OR the hero. */
export function useActiveMonster(
  level: Level,
  setLevel: (level: Level) => void
) {
  const { monsters, hero } = level;
  const activeMonster = monsters.find(({ turn }) => turn);

  const { won, lost, moving } = getLevelState(level);

  React.useEffect(() => {
    let valid = true;
    if (moving || won || lost) return;
    if (hero.turn) return;

    // Select the next active monster
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
      } else if (isAlive(hero) && monsters.some(isAlive)) {
        hero.turn = TurnStage.aim;
      }

      setLevel({ ...level });
      return;
    }

    // It is a monsters turn, so take a quick pause and then ATTACK!
    setTimeout(() => {
      if (!valid) return;
      if (moving || won || lost) return;
      if (isAlive(activeMonster) && activeMonster.turn == TurnStage.aim) {
        console.log("attack!");
        playgoblinTurn();
        const dx = hero.p.x - activeMonster.p.x;
        const dy = hero.p.y - activeMonster.p.y;
        const angle = Math.atan2(dy, dx);

        activeMonster.v.x = activeMonster.speed * Math.cos(angle);
        activeMonster.v.y = activeMonster.speed * Math.sin(angle);
      }

      activeMonster.turn = TurnStage.attack;
      setLevel({ ...level });
    }, 500);
    return () => void (valid = false);
  }, [moving, activeMonster, hero.turn]);

  return { activeMonster };
}
