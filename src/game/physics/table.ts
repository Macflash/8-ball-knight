import { playBumper } from "../../sounds/audio";
import { Ball } from "./ball";
import { magnitude, scale } from "./vec";

export class Table {
  private readonly friction = 0.002;
  private readonly bounce = -0.95;

  constructor(readonly width: number, readonly height: number) {}

  slowBall(ball: Ball) {
    const mag = magnitude(ball.v);
    if (mag > 0) {
      const newMag = Math.max(0, mag - this.friction);
      ball.v = scale(ball.v, newMag / mag);
    }
  }

  bounceBall(ball: Ball): boolean {
    let bumped = false;

    // Left
    if (ball.p.x <= ball.r) {
      ball.p.x = ball.r;
      ball.v.x *= this.bounce;
      bumped = true;
    }

    // Top
    if (ball.p.y <= ball.r) {
      ball.p.y = ball.r;
      ball.v.y *= this.bounce;
      bumped = true;
    }

    // Right
    if (ball.p.x + ball.r >= this.width) {
      ball.p.x = this.width - ball.r;
      ball.v.x *= this.bounce;
      bumped = true;
    }

    // Bottom
    if (ball.p.y + ball.r >= this.height) {
      ball.p.y = this.height - ball.r;
      ball.v.y *= this.bounce;
      bumped = true;
    }

    if (bumped) playBumper(); // could rate limit this if really needed.
    return bumped;
  }
}
