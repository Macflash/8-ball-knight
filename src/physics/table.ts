import { Ball } from "./ball";

export class Table {
  constructor(readonly width: number, readonly height: number) {}

  bounceBall(ball: Ball): boolean {
    let bumped = false;

    // Left
    if (ball.p.x <= ball.r) {
      ball.p.x = ball.r;
      ball.v.x *= -1;
      bumped = true;
    }

    // Top
    if (ball.p.y <= ball.r) {
      ball.p.y = ball.r;
      ball.v.y *= -1;
      bumped = true;
    }

    // Right
    if (ball.p.x + ball.r >= this.width) {
      ball.p.x = this.width - ball.r;
      ball.v.x *= -1;
      bumped = true;
    }

    // Bottom
    if (ball.p.y + ball.r >= this.height) {
      ball.p.y = this.height - ball.r;
      ball.v.y *= -1;
      bumped = true;
    }

    return bumped;
  }
}
