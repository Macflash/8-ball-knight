import logo from "./logo.svg";
import "./App.css";
import React from "react";

import table from "./images/table.png";
import orc from "./images/orc.png";
import orc_surprised from "./images/orc_surprised.png";

import cue from "./images/cue/default.png";
import happy from "./images/cue/happy.png";
import hurt from "./images/cue/hurt.png";
import surprised from "./images/cue/surprised.png";

const BALL_RADIUS = 30;
const width = 400;
const height = 550;

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
    if (ball.hole || ball.inPocket) return ball;

    // wall bounces
    if (ball.x > 400 - 2 * BALL_RADIUS || ball.x < 0) {
      ball.vx *= -1;
    }
    if (ball.y > 550 - 2 * BALL_RADIUS || ball.y < 0) {
      ball.vy *= -1;
    }

    const vel = magnitude(ball);
    const friction = 0.001;
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
    if (ballA.inPocket) continue;

    for (let j = i + 1; j < moved.length; j++) {
      const ballB = moved[j];
      if (ballB.inPocket) continue;

      const distanceBetweenCenters = distance(ballA, ballB);
      if (distanceBetweenCenters < 2 * BALL_RADIUS) {
        // Collision!
        if (ballB.hole) {
          console.log("pocketed", ballA);
          ballA.inPocket = true;
          continue;
        }

        // Undo any overlap
        const overlap = BALL_RADIUS * 2 - distanceBetweenCenters;

        const normalX = (ballA.x - ballB.x) / distanceBetweenCenters;
        const normalY = (ballA.y - ballB.y) / distanceBetweenCenters;

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
    // top corner pockets
    { hole: true, color: "black", x: -1 * BALL_RADIUS, y: -1 * BALL_RADIUS },
    { hole: true, color: "black", x: 400 - BALL_RADIUS, y: -1 * BALL_RADIUS },

    // center
    {
      hole: true,
      color: "black",
      x: -1.75 * BALL_RADIUS,
      y: 225 + 0.75 * BALL_RADIUS,
    },
    {
      hole: true,
      color: "black",
      x: 400 - 0.25 * BALL_RADIUS,
      y: 225 + 0.75 * BALL_RADIUS,
    },

    // bottom corner pockets
    { hole: true, color: "black", x: -1 * BALL_RADIUS, y: 550 - BALL_RADIUS },
    { hole: true, color: "black", x: 400 - BALL_RADIUS, y: 550 - BALL_RADIUS },

    {
      cue: true,
      color: "white",
      imgs: {
        default: cue,
        moving: surprised,
        hurt,
        happy,
      },
      x: 200,
      y: 450,
      vx: -0.1,
      vy: -2,
    },
    {
      color: "red",
      imgs: { default: orc, moving: orc_surprised },
      x: 200,
      y: 200,
      vx: 0,
      vy: 0,
    },
    {
      color: "yellow",
      imgs: { default: orc, moving: orc_surprised },
      x: 150,
      y: 150,
      vx: 0,
      vy: 0,
    },
    {
      color: "blue",
      imgs: { default: orc, moving: orc_surprised },
      x: 250,
      y: 150,
      vx: 0,
      vy: 0,
    },
  ]);

  React.useEffect(() => {
    setTimeout(() => {
      setTick((tick) => tick + 1);
      setBalls(moveBalls);
    }, 10);
  }, [tick, balls]);

  const moving = balls.some((ball) => magnitude(ball) > 0);

  return (
    <div
      style={{
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <img src={table} />
      <div
        style={{
          // background: "green",
          position: "absolute",
          width: 400,
          height: 550,
          marginBottom: 30,
        }}
      >
        {balls
          .filter(({ inPocket }) => !inPocket)
          .map((ball, index) => (
            <div
              key={index}
              style={{
                opacity: ball.hole ? 0.1 : 1,
                background: ball.color,
                boxShadow: `0 0 ${0.5 * BALL_RADIUS}px ${ball.color}`,
                position: "absolute",
                marginLeft: ball.x,
                marginTop: ball.y,
                height: BALL_RADIUS * 2,
                width: BALL_RADIUS * 2,
                borderRadius: BALL_RADIUS,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {ball.imgs ? (
                <img
                  style={{ marginTop: -0.1 * BALL_RADIUS }}
                  src={
                    ((ball.vx || ball.vy) && ball.imgs.moving) ||
                    ball.imgs.default
                  }
                  height={BALL_RADIUS * 2.5}
                ></img>
              ) : undefined}
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
