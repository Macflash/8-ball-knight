import { StickState } from "../game/hooks/useAimCue";
import { getLevelState, Level } from "../game/levels/level";
import { HeroEl } from "./hero";
import { MonsterEl } from "./monster";
import { ParticleEl } from "./particle";
import { PocketEl } from "./pocket";

/** Draws the table and everything on it. */
export function TableEl({
  level,
  cueStick,
}: {
  level: Level;
  cueStick: StickState;
}) {
  const { won, lost } = getLevelState(level);

  return (
    <div
      id="game-table"
      style={{
        marginLeft: 13,
        outline: "60px solid brown",
        background: "green",
        position: "absolute",
        width: level.table.width,
        height: level.table.height,
        marginBottom: 32,
      }}
    >
      {level.pockets.map((pocket, i) => (
        <PocketEl pocket={pocket} key={i} />
      ))}

      {level.monsters.map((m, i) => (
        <MonsterEl key={i} monster={m} lost={lost} />
      ))}

      <HeroEl
        hero={level.hero}
        won={won}
        aimDir={cueStick.aimDir}
        charge={cueStick.charge}
      />

      {level.particles.map((particle, i) => (
        <ParticleEl particle={particle} key={i} />
      ))}
    </div>
  );
}
