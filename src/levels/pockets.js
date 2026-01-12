import { width, height, BALL_RADIUS } from "../balls";

import rock from "../images/misc/rock.png";

// TODO: don't hard code these widths/heights, isntead allow multiple table sizes & configurations.

const pocket = {
  hole: true,
  imgs: {
    blocked: rock,
  },
  color: "black",
  x: 0,
  y: 0,
};

export const pockets = [
  // Pockets
  { ...pocket, x: 0, y: 0 },
  { ...pocket, x: width, y: 0 },
  {
    ...pocket,
    x: -0.75 * BALL_RADIUS,
    y: 0.5 * height + 0.25 * BALL_RADIUS,
    blocked: true,
  },
  {
    ...pocket,
    x: width + 0.75 * BALL_RADIUS,
    y: 0.5 * height + 0.25 * BALL_RADIUS,
  },
  { ...pocket, x: 0, y: height },
  { ...pocket, x: width, y: height },
];
