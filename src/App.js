import logo from "./logo.svg";
import "./App.css";
import React from "react";

import table from "./images/table.png";
import stick from "./images/stick.png";
import explosion from "./images/explosion.png";

import { imgs as cue_imgs } from "./images/cue/def";
import { imgs as goblin_imgs } from "./images/goblin/def";
import { imgs as orc_imgs } from "./images/orc/def";

const BALL_RADIUS = 30;
const width = 400;
const height = 536;

function distance(ballA, ballB) {
  return Math.sqrt(
    Math.pow(ballA.x + BALL_RADIUS - (ballB.x + BALL_RADIUS), 2) +
      Math.pow(ballA.y + BALL_RADIUS - (ballB.y + BALL_RADIUS), 2)
  );
}

function magnitude(ball) {
  return Math.sqrt(Math.pow(ball.vx, 2) + Math.pow(ball.vy, 2));
}

function moveBalls(balls) {
  const moved = balls.map((ball) => {
    // if the ATTACKING ball ever stops, end the attack.
    if (ball.attacking && magnitude(ball) < 0.01) {
      ball.attacking = false;
    }

    if (ball.explode) ball.explode--;
    if (ball.hole || ball.hp <= 0) return ball;

    // wall bounces
    if (ball.x > width - BALL_RADIUS || ball.x < BALL_RADIUS) {
      ball.vx *= -1;
    }
    if (ball.y > height - BALL_RADIUS || ball.y < BALL_RADIUS) {
      ball.vy *= -1;
    }

    const vel = magnitude(ball);
    const friction = 0.002;
    if (vel > 0) {
      const newVel = Math.max(0, vel - friction);
      ball.vx = (ball.vx / vel) * newVel;
      ball.vy = (ball.vy / vel) * newVel;
    }

    ball.x += ball.vx || 0;
    ball.y += ball.vy || 0;
    return ball;
  });

  for (let i = 0; i < moved.length; i++) {
    const ballA = moved[i];
    if (ballA.hole) continue;
    if (ballA.hp <= 0 && !ballA.hole) continue;

    for (let j = i + 1; j < moved.length; j++) {
      const ballB = moved[j];
      if (ballB.inPocket && !ballB.hole) continue;
      if (ballB.hp <= 0 && !ballB.hole) continue;

      const distanceBetweenCenters = distance(ballA, ballB);
      if (distanceBetweenCenters < 2 * BALL_RADIUS) {
        // Collision!
        if (ballB.hole) {
          console.log("pocketed", ballA);
          ballB.imgs = { normal: explosion };
          ballB.explode = 100;
          ballA.hp = 0;
          continue;
        }

        // DAMAGE! (monsters don't hurt each other!)
        if (ballA.monster !== ballB.monster) {
          if (ballA.attacking) {
            ballB.hp -= ballA.attack;
          } else if (ballB.attacking) {
            ballA.hp -= ballB.attack;
          }
        }

        // if either dies... maybe ignore the collision, like.. blast through?
        if (ballA.hp <= 0) {
          console.log("ballA dead!", ballA);
          ballA.explode = 100;
          continue;
        }
        if (ballB.hp <= 0) {
          console.log("ballB dead!", ballB);
          ballB.explode = 100;
          continue;
        }

        // Undo any overlap
        const overlap = BALL_RADIUS * 2 - distanceBetweenCenters;
        const normalX = (ballA.x - ballB.x) / distanceBetweenCenters;
        const normalY = (ballA.y - ballB.y) / distanceBetweenCenters;

        // This assumes equal mass/diameter for it to look right.
        ballA.x += (normalX * overlap) / 2;
        ballA.y += (normalY * overlap) / 2;
        ballB.x -= (normalX * overlap) / 2;
        ballB.x -= (normalY * overlap) / 2;

        // swap relative velocities

        const relVelX = ballA.vx - ballB.vx;
        const relVelY = ballA.vy - ballB.vy;
        const velAlongNormal = relVelX * normalX + relVelY * normalY;

        if (velAlongNormal > 0) continue;

        // swap the vel components
        ballA.vx -= velAlongNormal * normalX;
        ballA.vy -= velAlongNormal * normalY;
        ballB.vx += velAlongNormal * normalX;
        ballB.vy += velAlongNormal * normalY;
      }
    }
  }

  return moved;
}

function App() {
  const [tick, setTick] = React.useState(0);
  const [balls, setBalls] = React.useState([
    // Cue ball (YOU!)
    {
      cue: true,
      color: "rgba(255,255,255,0.5)",
      imgs: cue_imgs,
      x: 200,
      y: 450,
      vx: 0,
      vy: 0,
      hp: 5,
      maxhp: 5,
      attack: 2,
      active: true,
    },

    // Monsters!
    {
      monster: true,
      color: "rgba(255,0,0,0.5)",
      imgs: goblin_imgs,
      x: 200,
      y: 200,
      vx: 0,
      vy: 0,
      hp: 3,
      maxhp: 3,
      attack: 1,
      ranged: true,
    },
    {
      monster: true,
      color: "rgba(255,0,0,0.5)",
      imgs: orc_imgs,
      x: 150,
      y: 150,
      vx: 0,
      vy: 0,
      hp: 5,
      maxhp: 5,
      attack: 2,
    },
    {
      monster: true,
      color: "rgba(255,0,0,0.5)",
      imgs: orc_imgs,
      x: 250,
      y: 150,
      vx: 0,
      vy: 0,
      hp: 5,
      maxhp: 5,
      attack: 2,
    },

    // Pockets
    { hole: true, color: "black", x: 0, y: 0 },
    { hole: true, color: "black", x: 400, y: 0 },
    {
      hole: true,
      color: "black",
      x: -0.75 * BALL_RADIUS,
      y: 0.5 * height + 0.25 * BALL_RADIUS,
    },
    {
      hole: true,
      color: "black",
      x: width + 0.75 * BALL_RADIUS,
      y: 0.5 * height + 0.25 * BALL_RADIUS,
    },
    { hole: true, color: "black", x: 0, y: 550 },
    { hole: true, color: "black", x: 400, y: 550 },
  ]);

  const moving = balls.some((ball) => !ball.inPocket && magnitude(ball) > 0);
  const cueball = balls.find((ball) => ball.cue);
  const monsters = balls.filter(
    (ball) => !ball.cue && !ball.hole && !ball.inPocket
  );

  const activeMonster = monsters.find((ball) => ball.active);

  const won = !monsters.filter((ball) => ball.hp > 0).length;
  const lost = cueball.inPocket || cueball.hp <= 0;

  const [dir, setDir] = React.useState(0);

  // Move balls
  React.useEffect(() => {
    setTimeout(() => {
      // setTick((tick) => tick + 1);
      setBalls(moveBalls);
    }, 10);
  }, [moving, balls]);

  // Aim and move enemies when it is their turn
  React.useEffect(() => {
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
      if (activeMonster.hp > 0) {
        console.log("attack!");
        const dx = cueball.x - activeMonster.x;
        const dy = cueball.y - activeMonster.y;
        const angle = Math.atan2(dy, dx);

        const speed = 1;
        activeMonster.vx = speed * Math.cos(angle);
        activeMonster.vy = speed * Math.sin(angle);
      }

      // probably losing the index here. and getting thrown off?
      const activeIndex = monsters.indexOf(activeMonster);
      const nextMonster = monsters[activeIndex + 1];
      activeMonster.active = false;
      activeMonster.attacking = true;

      if (nextMonster?.monster) nextMonster.active = true;
      else if (cueball.hp > 0) cueball.active = true;
      setBalls([...balls]);
    }, 1500);
  }, [activeMonster, moving]);

  // stop attacks
  React.useEffect(() => {
    if (moving) return;
    setBalls((balls) => balls.map((ball) => ({ ...ball, attacking: false })));
  }, [moving, balls.filter((b) => b.attacking).length]);

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
      autoFocus={true}
      tabIndex={0}
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
        }
      }}
    >
      <img src={table} />
      <div
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
            style={{
              background:
                (!moving && ball.active) || magnitude(ball) ? ball.color : "",
              boxShadow:
                (!moving && ball.active) || magnitude(ball)
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
            {ball.hp > 0 && ball.imgs ? (
              <img
                style={{ marginTop: -0.1 * BALL_RADIUS }}
                src={
                  (ball.cue && won ? ball.imgs.happy : null) ||
                  (ball.monster && lost ? ball.imgs.happy : null) ||
                  (ball.hp < 0.5 * ball.maxhp ? ball.imgs.hurt : null) ||
                  ((ball.vx || ball.vy) &&
                    ball.attacking &&
                    ball.imgs.attack) ||
                  ((ball.vx || ball.vy) && ball.imgs.surprised) ||
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
            {ball.cue && ball.active && !moving && !won && !lost ? (
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
      {won && !lost ? (
        <div style={{ position: "absolute", color: "gold", fontSize: 100 }}>
          You won!
          <div>
            <button>Next level</button>
          </div>
        </div>
      ) : null}

      {lost ? (
        <div style={{ position: "absolute", color: "red", fontSize: 100 }}>
          GAME OVER!
          <br />
          <button>New game?</button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
