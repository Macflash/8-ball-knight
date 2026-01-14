import React from "react";
import { anythingMoving, Level } from "../levels/level";
import { isAlive, isDead } from "../types/hp";
import { TurnStage } from "../types/turn";
import { Vec } from "../physics/vec";
import { isMoving } from "../physics/ball";
import { magnitude } from "../../balls";

function stopAttackingWhenStill({ v, turn }: { v: Vec; turn?: TurnStage }) {
  if (turn == TurnStage.attack && !magnitude(v)) {
    turn = TurnStage.resolve;
  }
}

function pickNextActive(level: Level) {
  if (anythingMoving(level)) return;

  const { hero, monsters } = level;
  if (hero.turn == TurnStage.resolve) {
    // not moving & resolve means it is OVER!
  }
}

/** Selects the next living monster, OR the hero. */
export function useActiveMonster(level: Level) {
  const moving = anythingMoving(level);

  const { monsters, hero } = level;
  const activeMonster = monsters.find(({ turn }) => turn);

  React.useEffect(() => {
    if (moving) return;
    if (!activeMonster) return;
    console.log("checking active monster", activeMonster);

    // TODO: what about their turn is just... over?
    if (isDead(activeMonster)) {
      activeMonster.turn = TurnStage.inactive;
      const activeIndex = monsters.indexOf(activeMonster);
      const nextMonster = monsters[activeIndex + 1];

      if (nextMonster?.monster) {
        nextMonster.turn = TurnStage.aim;
      } else if (isAlive(hero)) {
        hero.turn = TurnStage.aim;
      }
    }
  }, [moving, activeMonster, hero.turn]);

  return { activeMonster };
}
