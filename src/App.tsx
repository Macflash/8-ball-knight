import "./App.css";
import React from "react";
import { height, width, angleFromAtoB } from "./balls";
import { playBallDrop, playCueTurn, playgoblinTurn } from "./sounds/audio";
import { isAlive, isDead } from "./game/types/hp";
import { TurnStage } from "./game/types/turn";
import { tablePng } from "./images/misc";
import { useMoveLevel } from "./game/hooks/useMoveLevel";
import { HeroEl } from "./components/hero";
import { MonsterEl } from "./components/monster";
import { getLevel } from "./game/levels/level_defs";
import { useActiveMonster } from "./game/hooks/useEnemyTurn";

function App() {
  const { level, setLevel, moving } = useMoveLevel(getLevel(1));

  const cueball = level.hero;
  const monsters = level.monsters;

  const { activeMonster } = useActiveMonster(level);

  // Aim and move enemies when it is their turn
  React.useEffect(() => {
    let valid = true;

    if (moving) return;
    if (!activeMonster) return;

    console.log("setting timeout...");

    setTimeout(() => {
      if (!valid) return;
      if (won || lost) return;
      if (isAlive(activeMonster)) {
        console.log("attack!");
        playgoblinTurn();
        // const dx = cueball.x - activeMonster.x;
        // const dy = cueball.y - activeMonster.y;
        // const angle = Math.atan2(dy, dx);

        // activeMonster.vx = activeMonster.speed * Math.cos(angle);
        // activeMonster.vy = activeMonster.speed * Math.sin(angle);
      }

      // probably losing the index here. and getting thrown off?
      // const activeIndex = monsters.indexOf(activeMonster);
      // const nextMonster = monsters[activeIndex + 1];
      // console.log("next monster", nextMonster);

      activeMonster.turn = TurnStage.attack;

      // setBalls([...balls]);
    }, 1500);
    return () => void (valid = false);
  }, [activeMonster, moving]);

  const won = !monsters.some(isAlive);
  const lost = isDead(cueball);

  // moving check here is probably redundant now
  const aiming = cueball.turn == TurnStage.aim && !moving && !won && !lost;

  // TODO: Let you keep shooting if you pocket an enemy!

  // Ball turn
  // AIM
  // ATTACK
  // RESOLVE <-- this is when we change turns!

  // Move balls

  const dir = level.hero.aimDirection;
  const setDir = (aimDirection: number) => {
    // if (moving) return;
    setLevel({ ...level, hero: { ...level.hero, aimDirection } });
  };

  const shoot = React.useCallback(() => {
    if (cueball.turn !== TurnStage.aim) return;
    // // shoot the cue ball
    const speed = 2;
    const radians = ((90 - level.hero.aimDirection) * Math.PI) / 180;
    cueball.v.x = speed * Math.cos(radians);
    cueball.v.y = -speed * Math.sin(radians);
    // move active state!
    cueball.turn = TurnStage.attack;

    setLevel({ ...level });

    playBallDrop();
  }, [level, setLevel]);

  React.useEffect(() => {
    if (level.hero.turn) console.log("hero's turn", level.hero.turn);
    else if (activeMonster?.turn)
      console.log("monster turn", activeMonster?.turn);
  }, [level.hero.turn, activeMonster?.turn]);

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
          x: tablePos.offsetLeft + cueball.p.x,
          y: tablePos.offsetTop + cueball.p.y,
        };
        const m = { x: e.clientX, y: e.clientY };
        const angle = angleFromAtoB(m, cuepos);
        const degrees = (angle * 180) / Math.PI;
        setDir(degrees + 90);
      }}
      onMouseDown={() => {
        if (aiming) {
          shoot();
        }
      }}
      onKeyDown={(e) => {
        if (moving) return;
        if (!cueball.turn) return;

        // console.log("key", e.key, dir);
        if (e.key === "ArrowLeft" || e.key === "a") {
          setDir(dir + 3);
        }
        if (e.key === "ArrowRight" || e.key === "d") {
          setDir(dir - 3);
        }

        if (e.key == "ArrowUp" || e.key == "w") {
          shoot();
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
          width,
          height,
          marginBottom: 32,
        }}
      >
        <HeroEl hero={level.hero} />
        {level.monsters.map((m, i) => (
          <MonsterEl key={i} monster={m} />
        ))}
        {[level.hero].map((ball, index) => (
          <div
            key={index}
            id={ball.hero ? "game-cue" : undefined}
            style={{
              position: "absolute",
              marginLeft: ball.p.x - ball.r,
              marginTop: ball.p.y - ball.r,
              height: ball.r * 2,
              width: ball.r * 2,
              borderRadius: ball.r,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* {ball.hole && ball.blocked ? (
              <img
                style={{ marginTop: -0.1 * ball.r }}
                src={ball.imgs.blocked}
                height={ball.r * 2.5}
              ></img>
            ) : undefined} */}

            {/* {ball.explode ? (
              <img
                style={{ position: "absolute" }}
                src={explosion}
                height={ball.r * 4}
              />
            ) : null} */}
          </div>
        ))}
      </div>
      {won ? (
        <div style={{ position: "absolute", color: "gold", fontSize: 100 }}>
          You won!
          <div>
            <button
              onClick={() => {
                // setLevel(level + 1);
                // setBalls(getLevel(level + 1));
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
              // setLevel(0);
              // setBalls(getLevel(0));
              setDir(0);
            }}
          >
            New game?
          </button>
        </div>
      ) : null}

      {/* <div
        style={{
          position: "absolute",
          top: 0,
          color: "white",
          fontSize: "2rem",
        }}
      >
        Level {level + 1}
      </div> */}
    </div>
  );
}

export default App;
