import "./App.css";
import React from "react";

import table from "./images/misc/table.png";
import stick from "./images/misc/stick.png";
import explosion from "./images/misc/explosion.png";

import {
  moveBalls,
  BALL_RADIUS,
  height,
  width,
  magnitude,
  angleFromAtoB,
} from "./balls";
import { getLevel } from "./levels/levels";

function App() {
  const [level, setLevel] = React.useState(0);
  const [balls, setBalls] = React.useState(getLevel(level));

  const moving = balls.some((ball) => magnitude(ball) > 0 && ball.hp > 0);
  const cueball = balls.find((ball) => ball.cue);
  const monsters = balls.filter((ball) => !ball.cue && !ball.hole);

  const activeMonster = monsters.find((ball) => ball.active);

  const won = !monsters.filter((ball) => ball.hp > 0).length;
  const lost = cueball.hp <= 0;

  const aiming = cueball.active && !moving && !won && !lost;
  const [dir, setDir] = React.useState(0);

  // TODO: Let you keep shooting if you pocket an enemy!

  // Move balls
  React.useEffect(() => {
    let valid = true;
    requestAnimationFrame(() => {
      if (!valid) return;
      setBalls(moveBalls);
    });
    return () => (valid = false);
  }, [moving, balls]);

  // Aim and move enemies when it is their turn
  React.useEffect(() => {
    let valid = true;

    if (moving) return;
    if (!activeMonster) return;

    console.log("active monster", activeMonster);

    if (activeMonster.hp <= 0) {
      console.log("active is dead");
      const activeIndex = monsters.indexOf(activeMonster);
      const nextMonster = monsters[activeIndex + 1];
      activeMonster.active = false;
      activeMonster.attacking = true;

      if (nextMonster?.monster) nextMonster.active = true;
      else if (cueball.hp > 0) cueball.active = true;
    }

    console.log("setting timeout...");

    setTimeout(() => {
      if (!valid) return;
      if (won || lost) return;
      if (activeMonster.hp > 0) {
        console.log("attack!");
        const dx = cueball.x - activeMonster.x;
        const dy = cueball.y - activeMonster.y;
        const angle = Math.atan2(dy, dx);

        activeMonster.vx = activeMonster.speed * Math.cos(angle);
        activeMonster.vy = activeMonster.speed * Math.sin(angle);
      }

      // probably losing the index here. and getting thrown off?
      const activeIndex = monsters.indexOf(activeMonster);
      const nextMonster = monsters[activeIndex + 1];
      console.log("next monster", nextMonster);

      activeMonster.active = false;
      activeMonster.attacking = true;

      if (nextMonster?.monster) nextMonster.active = true;
      else if (cueball.hp > 0) cueball.active = true;
      setBalls([...balls]);
    }, 1500);
    return () => (valid = false);
  }, [activeMonster, moving]);

  const shoot = React.useCallback(() => {
    // shoot the cue ball
    const speed = 2;
    const radians = ((90 - dir) * Math.PI) / 180;
    cueball.vx = speed * Math.cos(radians);
    cueball.vy = -speed * Math.sin(radians);
    // move active state!
    cueball.active = false;
    cueball.attacking = true;

    const nextMonster = monsters[0];
    if (nextMonster) nextMonster.active = true;
    setBalls([...balls]);
  }, [balls, setBalls]);

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
        // if (aiming) {
        // console.log(e);
        // get angle
        const tablePos = document.getElementById("game-table");
        const cuepos = {
          x: tablePos.offsetLeft + cueball.x,
          y: tablePos.offsetTop + cueball.y,
        };
        const m = { x: e.clientX, y: e.clientY };
        const angle = angleFromAtoB(m, cuepos);
        const degrees = (angle * 180) / Math.PI;
        // console.log(degrees, m, cuepos);
        setDir(degrees + 90);
      }}
      onMouseDown={() => {
        if (aiming) {
          shoot();
        }
      }}
      onKeyDown={(e) => {
        if (moving) return;
        if (!cueball.active) return;

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
      <img src={table} />
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
        {balls.map((ball, index) => (
          <div
            key={index}
            id={ball.cue ? "game-cue" : undefined}
            style={{
              background:
                (!moving && ball.hp > 0 && ball.active) || magnitude(ball)
                  ? ball.color
                  : "",
              boxShadow:
                (!moving && ball.hp > 0 && ball.active) || magnitude(ball)
                  ? `0 0 ${0.5 * BALL_RADIUS}px ${ball.color}`
                  : "",
              position: "absolute",
              marginLeft: ball.x - BALL_RADIUS,
              marginTop: ball.y - BALL_RADIUS,
              height: BALL_RADIUS * 2,
              width: BALL_RADIUS * 2,
              borderRadius: BALL_RADIUS,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {ball.hole && ball.blocked ? (
              <img
                style={{ marginTop: -0.1 * BALL_RADIUS }}
                src={ball.imgs.blocked}
                height={BALL_RADIUS * 2.5}
              ></img>
            ) : undefined}
            {ball.hp > 0 && ball.imgs ? (
              <img
                style={{ marginTop: -0.1 * BALL_RADIUS }}
                src={
                  (ball.cue && won ? ball.imgs.happy : null) ||
                  (ball.monster && lost ? ball.imgs.happy : null) ||
                  ((ball.vx || ball.vy) &&
                    ball.attacking &&
                    ball.imgs.attack) ||
                  ((ball.vx || ball.vy) && ball.imgs.surprised) ||
                  (ball.hp < 0.5 * ball.maxhp ? ball.imgs.hurt : null) ||
                  ball.imgs.normal
                }
                height={BALL_RADIUS * 2.5}
              ></img>
            ) : undefined}
            {ball.explode ? (
              <img
                style={{ position: "absolute" }}
                src={explosion}
                height={BALL_RADIUS * 4}
              />
            ) : null}
            {ball.hp > 0 ? (
              <div
                style={{
                  position: "absolute",
                  color: "white",
                  top: -1 * BALL_RADIUS,
                  width: "max-content",
                }}
              >
                {ball.hp}♥️
                {ball.attack
                  ? ` ${ball.attack}${ball.ranged ? "🏹" : "🗡️"}`
                  : undefined}
              </div>
            ) : undefined}
            {ball.cue && aiming ? (
              <img
                src={stick}
                height={BALL_RADIUS * 10}
                style={{
                  position: "absolute",
                  transform: `
                    rotate(${dir - 41}deg)
                     translate(-${4.15 * BALL_RADIUS}px,
                    ${5 * BALL_RADIUS}px)`,
                  zIndex: 2,
                }}
              />
            ) : null}
          </div>
        ))}
      </div>
      {won ? (
        <div style={{ position: "absolute", color: "gold", fontSize: 100 }}>
          You won!
          <div>
            <button
              onClick={() => {
                setLevel(level + 1);
                setBalls(getLevel(level + 1));
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
              setLevel(0);
              setBalls(getLevel(0));
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
        Level {level + 1}
      </div>
    </div>
  );
}

export default App;
