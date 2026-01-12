import logo from "./logo.svg";
import "./App.css";
import React from "react";

import table from "./images/table.png";

const BALL_RADIUS = 20;
const width = 400;
const height = 550;

function distance(ballA, ballB) {
  return Math.sqrt(
    Math.pow(ballA.x + BALL_RADIUS - (ballB.x + BALL_RADIUS), 2) +
      Math.pow(ballA.y + BALL_RADIUS - (ballB.y + BALL_RADIUS), 2)
  );
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
        if (ballB.hole) {
          ballA.inPocket = true;
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
      x: -1 * BALL_RADIUS,
      y: 225 + 2 * BALL_RADIUS,
    },
    {
      hole: true,
      color: "black",
      x: 400 - BALL_RADIUS,
      y: 225 + 2 * BALL_RADIUS,
    },

    // bottom corner pockets
    { hole: true, color: "black", x: -1 * BALL_RADIUS, y: 550 - BALL_RADIUS },
    { hole: true, color: "black", x: 400 - BALL_RADIUS, y: 550 - BALL_RADIUS },

    {
      cue: true,
      color: "white",
      x: 200,
      y: 450,
      vx: -0.1,
      vy: -2,
    },
    {
      color: "red",
      x: 200,
      y: 200,
      vx: 0,
      vy: 0,
    },
    {
      color: "yellow",
      x: 150,
      y: 150,
      vx: 0,
      vy: 0,
    },
    {
      color: "blue",
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
          background: "green",
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
                background: ball.color,
                position: "absolute",
                marginLeft: ball.x,
                marginTop: ball.y,
                height: BALL_RADIUS * 2,
                width: BALL_RADIUS * 2,
                borderRadius: BALL_RADIUS,
              }}
            ></div>
          ))}
      </div>
    </div>
  );
}

export default App;
