import "./App.css";
import React from "react";
import { playBallDrop, playCueTurn, playgoblinTurn } from "./sounds/audio";
import { isAiming, TurnStage } from "./game/types/turn";
import { tablePng } from "./images/misc";
import { useMoveLevel } from "./game/hooks/useMoveLevel";
import { HeroEl } from "./components/hero";
import { MonsterEl } from "./components/monster";
import { getLevel } from "./game/levels/level_defs";
import { useActiveMonster } from "./game/hooks/useEnemyTurn";
import { useHeroTurn } from "./game/hooks/useHeroTurn";
import { add, angleFromAtoB, fromCueAngle, scale } from "./game/physics/vec";
import { getLevelState } from "./game/levels/level";
import { PocketEl } from "./components/pocket";

function App() {
  const [levelNum, setLevelNum] = React.useState(0);
  const { level, setLevel, moving } = useMoveLevel(getLevel(levelNum));

  const { hero } = useHeroTurn(level, setLevel);
  const { activeMonster } = useActiveMonster(level, setLevel);

  const { won, lost } = getLevelState(level);

  // TBH we could keep this as some separate state...
  // and pass it to the cuestick. but whatever this works for now?
  const dir = level.hero.aimDirection;
  const setDir = (aimDirection: number) => {
    if (won || lost) return;
    // OMG this was it. jesus christ.
    setLevel({ ...level, hero: { ...level.hero, aimDirection } });
  };

  // TODO: Let you keep shooting if you pocket an enemy!
  const shoot = React.useCallback(
    (roll = 0, side = 0) => {
      if (!isAiming(hero)) return;

      // shoot the cue ball
      hero.v = fromCueAngle(hero.aimDirection, hero.maxSpeed);
      if (roll) hero.a = scale(hero.v, roll);
      if (side) {
        hero.a = add(
          hero.a,
          fromCueAngle(hero.aimDirection + side * 90, hero.maxSpeed * 2),
        );
      }
      hero.turn = TurnStage.attack;

      setLevel({ ...level });
      playBallDrop();
    },
    [level, setLevel],
  );

  return (
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
        const tablePos = document.getElementById("game-table")!;
        const cuepos = {
          x: tablePos.offsetLeft + hero.p.x,
          y: tablePos.offsetTop + hero.p.y,
        };
        const m = { x: e.clientX, y: e.clientY };
        const angle = angleFromAtoB(m, cuepos);
        const degrees = (angle * 180) / Math.PI;
        setDir(degrees + 90);
      }}
      onMouseDown={() => shoot(0.5)}
      onKeyDown={(e) => {
        if (moving) return;
        if (!hero.turn) return;

        // console.log("key", e.key, dir);
        if (e.key === "ArrowLeft" || e.key === "a") {
          shoot(0, -1);
          // setDir(dir + 3);
        }

        if (e.key === "ArrowRight" || e.key === "d") {
          shoot(0, 1);
          // setDir(dir - 3);
        }

        if (e.key == "ArrowUp" || e.key == "w") {
          shoot(1.5);
        }

        if (e.key == "Space") {
          shoot(0);
        }

        if (e.key == "ArrowDown" || e.key == "s") {
          shoot(-0.5);
        }
      }}
    >
      <img src={tablePng} />
      <div
        id="game-table"
        style={{
          marginLeft: 13,
          // border: "1px solid green",
          position: "absolute",
          width: level.table.width,
          height: level.table.height,
          marginBottom: 32,
        }}
      >
        <HeroEl hero={level.hero} />
        {level.monsters.map((m, i) => (
          <MonsterEl key={i} monster={m} />
        ))}
        {level.pockets.map((pocket, i) => (
          <PocketEl pocket={pocket} key={i} />
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
                setDir(0);
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
              setDir(0);
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
  );
}

export default App;
