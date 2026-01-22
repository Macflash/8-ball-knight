import { table } from "console";
import { playScratch, playboom, playBallDrop } from "../../sounds/audio";
import { getLevelState, Level } from "../levels/level";
import { particle } from "../levels/particle";
import { pockets } from "../levels/pockets";
import { intersect } from "../physics/ball";
import { at, vec } from "../physics/vec";
import { isDead, damage } from "../types/hp";
import { isAttacking, TurnStage } from "../types/turn";

export function pocketTick(level: Level) {
  const { hero, table, monsters, pockets, particles } = level;
  const { won, lost } = getLevelState(level);

  for (const pocket of pockets) {
    if (won || lost) continue;
    if (pocket.blocked) continue;
    if (isDead(hero)) continue;
    if (intersect(pocket, hero)) {
      level.particles.push(particle({ p: at(pocket.p) }));
      damage(hero.h, 1);
      hero.v = vec();
      hero.a = vec();
      hero.p = vec(table.width / 2, table.height / 2);
      playScratch();

      // if you SCRATCH, you DON'T get another turn though!
      hero.scratched = true;
      if (isAttacking(hero)) hero.turn = TurnStage.resolve;
    }

    for (const monster of monsters) {
      if (isDead(monster)) continue;
      if (intersect(pocket, monster)) {
        playboom();
        level.particles.push(particle({ p: at(pocket.p) }));
        monster.h.p = 0;
        playBallDrop();

        // If it is the HERO's turn, they get to keep going!
        if (isAttacking(hero)) {
          hero.pocketedEnemy = true;
        }
      }
    }
  }
}
