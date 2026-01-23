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
  fromCueAngle,
  scale,
  vec,
} from "./game/physics/vec";
import { getLevelState } from "./game/levels/level";
import { PocketEl } from "./components/pocket";
import { ParticleEl } from "./components/particle";
import { particle } from "./game/levels/particle";

function App() {
  const [levelNum, setLevelNum] = React.useState(1);
  const { level, setLevel, moving } = useMoveLevel(getLevel(levelNum));

  const { hero } = useHeroTurn(level, setLevel);
  const { activeMonster } = useActiveMonster(level, setLevel);
  const { won, lost } = getLevelState(level);

  const [aimDir, setAimDir] = React.useState(0);
  const [charge, setCharge] = React.useState(0);
  const chargeVal = Math.sin((charge - 180) / 180) + 1;
  const [isCharging, setIsCharging] = React.useState(false);

  React.useEffect(() => {
    if (!isCharging) return;
    let valid = true;

    // charge could be like... an angle.
    requestAnimationFrame(() => {
      if (!valid) return;
      setCharge((c) => c + 10);
    });
    return () => {
      valid = false;
    };
  }, [isCharging, charge, setCharge]);

  const shoot = React.useCallback(
    (roll = 0, side = 0, speed = 1) => {
      if (!isAiming(hero)) return;

      // a number between 0 and 2?
      console.log(chargeVal);

      // shoot the cue ball
      hero.v = fromCueAngle(aimDir, hero.maxSpeed * (chargeVal + 0.25));
      if (roll) hero.a = scale(hero.v, roll);
      if (side) {
        hero.a = add(
          hero.a,
          fromCueAngle(aimDir + side * 90, hero.maxSpeed * 2),
        );
      }
      hero.turn = TurnStage.attack;

      setIsCharging(false);
      setCharge(0);
      setLevel({ ...level });
      playBallDrop();
    },
    [level, setLevel, aimDir, chargeVal],
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
        // e.target // is this NOT the table? NO ITS NOT. this is the whole window.
        const tEl = document.getElementById("game-table")!;
        const tp = vec(tEl.offsetLeft, tEl.offsetTop);
        const cuep = add(tp, hero.p);
        const mousep = vec(e.clientX, e.clientY);
        const angle = angleFromAtoB(mousep, cuep);
        const degrees = (angle * 180) / Math.PI;
        setAimDir(degrees + 90);
      }}
      onMouseDown={() => {
        if (isAiming(hero)) setIsCharging(true);
      }}
      onMouseUp={() => {
        if (isAiming(hero) && isCharging) {
          shoot(1);
        }
      }}
      onKeyDown={(e) => {
        if (isAiming(hero)) setIsCharging(true);
      }}
      onKeyUp={(e) => {
        console.log(e.key);
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

        if (e.key == "ArrowDown" || e.key == "s") {
          shoot(-1, 0, 1.75);
        }

        if (e.key == "Space" || e.key == " ") {
          console.log("SPACE!");
          if (isAiming(hero)) {
            console.log("ARROW!");
            const p = particle({
              image: rockPng,
              r: 10,
              m: 10,
              v: fromCueAngle(aimDir, 3),
              p: hero.p,
              collide: true,
              lifespan: 1_000,
            });
            level.particles.push(p);

            hero.turn = TurnStage.attack;

            setLevel({ ...level });
            playBallDrop();
          }
        }
      }}
    >
      <img src={tablePng} />
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
        <HeroEl
          hero={level.hero}
          won={won}
          aimDir={aimDir}
          charge={chargeVal}
        />
        {level.monsters.map((m, i) => (
          <MonsterEl key={i} monster={m} lost={lost} />
        ))}
        {level.pockets.map((pocket, i) => (
          <PocketEl pocket={pocket} key={i} />
        ))}
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
                setAimDir(0);
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
              setAimDir(0);
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
