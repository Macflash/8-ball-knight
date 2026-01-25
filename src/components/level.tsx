import React from "react";
import { useAimCue } from "../game/hooks/useAimCue";
import { useActiveMonster } from "../game/hooks/useEnemyTurn";
import { useHeroTurn } from "../game/hooks/useHeroTurn";
import { useMoveLevel } from "../game/hooks/useMoveLevel";
import { CueAttack, CueShot } from "../game/levels/attack";
import { getLevelState, Level } from "../game/levels/level";
import { vec } from "../game/physics/vec";
import { hasEnoughEnergy } from "../game/types/energy";
import { isAiming } from "../game/types/turn";
import { playBallDrop } from "../sounds/audio";
import { TableEl } from "./tables";

// All the stuff to PLAY a level.
export function LevelEl({
  initialLevel,
  onTurnEnd,
}: {
  initialLevel: Level;
  onTurnEnd: (level: Level) => void;
}) {
  const { level, setLevel, moving } = useMoveLevel(initialLevel);

  const { hero } = useHeroTurn(level, setLevel);
  const { activeMonster } = useActiveMonster(level, setLevel);
  const { won, lost } = getLevelState(level);

  React.useEffect(() => {
    if (!moving && (won || lost)) onTurnEnd(level);
  }, [moving, won, lost]);

  const cueStick = useAimCue();

  const [activeShot, setActiveShot] = React.useState<CueAttack | null>(null);

  const shoot = React.useCallback(() => {
    if (!isAiming(hero)) return;

    const shot = activeShot || hero.knownAttacks[0]!;

    CueShot(hero, cueStick, shot);

    cueStick.reset();
    setLevel({ ...level });
    playBallDrop();
  }, [level, setLevel, cueStick, activeShot]);

  return (
    <>
      <div
        style={{
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          position: "relative",
        }}
        id="the-game"
        autoFocus={true}
        tabIndex={0}
        ref={() => document.getElementById("the-game")?.focus()}
        onMouseMove={(e) => {
          const mousep = vec(e.clientX, e.clientY);
          cueStick.onMouseMove(mousep, hero.p);
        }}
        onMouseDown={() => {
          cueStick.onMouseDown(hero);
        }}
        onMouseUp={() => {
          if (isAiming(hero) && cueStick.isCharging) {
            shoot();
          }
        }}
        // TODO: Handle Keyboard/controller input
      >
        {/* <img src={tablePng} /> */}
        <TableEl level={level} cueStick={cueStick} />
      </div>
      {isAiming(hero) ? (
        <div
          style={{
            zIndex: 100,
            background: "darkgreen",
            position: "absolute",
            bottom: 0,
            color: "white",
            display: "flex",
          }}
        >
          {hero.knownAttacks.map((attack, i) => (
            <div
              key={i}
              style={{
                border: "1px solid white",
                margin: 10,
                padding: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: activeShot == attack ? "green" : "white",
              }}
              role="button"
              onClick={
                hasEnoughEnergy(hero, attack.cost || 0)
                  ? () => {
                      setActiveShot(attack);
                    }
                  : undefined
              }
            >
              <div>{attack.name}</div>
              {attack.cost ? <div>{attack.cost}⚡</div> : undefined}
            </div>
          ))}
        </div>
      ) : undefined}
    </>
  );
}
