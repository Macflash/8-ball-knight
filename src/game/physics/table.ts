import { playBumper } from "../../sounds/audio";
import { Ball } from "./ball";
import { add, magnitude, scale, subtract, Vec } from "./vec";

export class Table {
  // rolling
  private readonly friction = 0.002; //25 also worked

  private readonly slipFriction = 0.005; // .01 was OK, but maybe a bit strong

  private readonly bounce = -0.95;

  constructor(readonly width: number, readonly height: number) {}

  private reduceVec(v: Vec, f = this.friction): Vec {
    const mag = magnitude(v);
    if (mag == 0) return v;

    return scale(v, Math.max(0, mag - this.friction) / mag);
  }

  slowBall(ball: Ball) {
    // Friction (NOT ACCURATE, BUT SIMPLE)
    ball.v = this.reduceVec(ball.v);
    ball.a = this.reduceVec(ball.a, 0.5 * this.friction); // idk if this is right.

    if (ball.a.x != ball.v.x || ball.a.y != ball.v.y) {
      const slip = subtract(ball.a, ball.v);
      const force = scale(slip, this.slipFriction);
      ball.v = add(ball.v, force);
      ball.a = subtract(ball.a, force);
    }

    // // Hmm, if ball.a is 0, it will NOT change.
    // if (ball.a != ball.v) {
    //   ball.v = add(scale(ball.a, this.friction), ball.v);
    //   ball.a = this.reduceVec(ball.a);
    // }
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
