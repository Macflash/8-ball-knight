import "./App.css";
import React from "react";
import { playBallDrop, playCueTurn, playgoblinTurn } from "./sounds/audio";
import { isAiming, TurnStage } from "./game/types/turn";
import { rockPng, tablePng } from "./images/misc/misc";
import { useMoveLevel } from "./game/hooks/useMoveLevel";
import { HeroEl } from "./components/hero";
import { MonsterEl } from "./components/monster";
import { getLevel } from "./game/levels/level_defs";
import { useActiveMonster } from "./game/hooks/useEnemyTurn";
import { useHeroTurn } from "./game/hooks/useHeroTurn";
import {
  add,
  angleFromAtoB,
  distance,
  fromCueAngle,
  magnitude,
  scale,
  subtract,
  vec,
} from "./game/physics/vec";
import { getLevelState } from "./game/levels/level";
import { PocketEl } from "./components/pocket";
import { ParticleEl } from "./components/particle";
import { particle } from "./game/levels/particle";
import { useAimCue } from "./game/hooks/useAimCue";
import { BasicAttack, CueAttack, CueShot } from "./game/levels/attack";
import { hasEnoughEnergy } from "./game/types/energy";

function App() {
  const [levelNum, setLevelNum] = React.useState(1);
  const { level, setLevel, moving } = useMoveLevel(getLevel(levelNum));

  const { hero } = useHeroTurn(level, setLevel);
  const { activeMonster } = useActiveMonster(level, setLevel);
  const { won, lost } = getLevelState(level);

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
          // cursor: "none",
        }}
        id="the-game"
        autoFocus={true}
        tabIndex={0}
        ref={() => document.getElementById("the-game")?.focus()}
        onMouseMove={(e) => {
          // there might be a better way to move this JUNK into the useAimCue function.
          const tEl = document.getElementById("game-table")!;
          const tp = vec(tEl.offsetLeft, tEl.offsetTop);
          const cuep = add(tp, hero.p);
          const mousep = vec(e.clientX, e.clientY);
          if (cueStick.isCharging) cueStick.setRelease(mousep);
          else {
            const angle = angleFromAtoB(mousep, cuep);
            const degrees = (angle * 180) / Math.PI;
            cueStick.setAimDir(degrees + 90);
            cueStick.setStart(mousep);
          }
        }}
        onMouseDown={() => {
          if (isAiming(hero)) cueStick.setIsCharging(true);
        }}
        onMouseUp={() => {
          if (isAiming(hero) && cueStick.isCharging) {
            shoot();
          }
        }}
        onKeyDown={(e) => {
          if (isAiming(hero)) cueStick.setIsCharging(true);
        }}
      >
        {/* <img src={tablePng} /> */}
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
        {won ? (
          <div style={{ position: "absolute", color: "gold", fontSize: 100 }}>
            You won!
            <div>
              <button
                onClick={() => {
                  const newLevel = levelNum + 1;
                  setLevelNum(newLevel);
                  setLevel(getLevel(newLevel));
                  cueStick.reset();
                }}
              >
                Next level
              </button>
            </div>
          </div>
        ) : null}

        {lost && !won ? (
          <div style={{ position: "absolute", color: "red", fontSize: 100 }}>
            GAME OVER!
            <br />
            <button
              onClick={() => {
                setLevelNum(0);
                setLevel(getLevel(0));
                cueStick.reset();
              }}
            >
              New game?
            </button>
          </div>
        ) : null}

        <div
          style={{
            position: "absolute",
            top: 0,
            color: "white",
            fontSize: "2rem",
          }}
        >
          Level {levelNum}
        </div>
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

export default App;
