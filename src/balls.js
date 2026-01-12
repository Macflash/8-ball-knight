export const BALL_RADIUS = 30;
export const width = 400;
export const height = 536;

export function distance(ballA, ballB) {
  return Math.sqrt(
    Math.pow(ballA.x + BALL_RADIUS - (ballB.x + BALL_RADIUS), 2) +
      Math.pow(ballA.y + BALL_RADIUS - (ballB.y + BALL_RADIUS), 2)
  );
}

export function magnitude(ball) {
  return Math.sqrt(Math.pow(ball.vx, 2) + Math.pow(ball.vy, 2));
}

export function angleFromAtoB(ballA, ballB) {
  const dx = ballB.x - ballA.x;
  const dy = ballB.y - ballA.y;
  return Math.atan2(dy, dx);
}

export function moveBalls(balls) {
  const moved = balls.map((ball) => {
    // if the ATTACKING ball ever stops, end the attack.
    if (ball.attacking && magnitude(ball) < 0.01) {
      ball.attacking = false;
    }

    if (ball.explode) ball.explode--;
    if (ball.hole || ball.hp <= 0) return ball;

    // wall bounces
    // could change this to take some of the other direction off too
    // could depend on the spin, etc if we wanna get fancy later.
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
      if (ballB.hp <= 0 && !ballB.hole) continue;

      const distanceBetweenCenters = distance(ballA, ballB);
      if (distanceBetweenCenters < 2 * BALL_RADIUS) {
        // Collision!
        if (ballB.hole) {
          if (ballB.blocked) {
            console.log("blocked!");
            continue;
          }

          console.log("pocketed", ballA);
          ballB.explode = 100;
          ballA.hp = 0;
          ballA.vx = 0;
          ballA.vy = 0;
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
        if (!ballA.hole && ballA.hp <= 0) {
          console.log("ballA dead!", ballA);
          ballA.explode = 100;
          ballA.hp = 0;
          ballA.vx = 0;
          ballA.vy = 0;
          continue; // continuing might be weird here.
        }
        if (!ballB.hole && ballB.hp <= 0) {
          console.log("ballB dead!", ballB);
          ballB.explode = 100;
          ballB.hp = 0;
          ballB.vx = 0;
          ballB.vy = 0;
          continue; // continuing might be weird here.
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
