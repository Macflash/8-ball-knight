import { width, height, BALL_RADIUS } from "../balls";

// TODO: don't hard code these widths/heights, isntead allow multiple table sizes & configurations.

export const pockets = [
  // Pockets
  { hole: true, color: "black", x: 0, y: 0 },
  { hole: true, color: "black", x: width, y: 0 },
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
  { hole: true, color: "black", x: 0, y: height },
  { hole: true, color: "black", x: width, y: height },
];
