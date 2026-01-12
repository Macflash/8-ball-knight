import { width } from "../balls";
import { imgs } from "../images/cue/def";

// TODO: maybe only take like 1HP damage and lose a turn if you scratch
// EXCEPT last turn probably? MAYBE just on boss levels as it gets a bit annoying.
// 8 ball is a boss who you can't kill until all the other ones are dead.
// PROTECT mission? where you have helpers or maybe have to protect your own 8 ball?
// 8 ball could be a dark hero you unlock later or play as? like necromancer style?
export const cue = {
  cue: true,
  color: "rgba(255,255,255,0.5)",
  imgs,
  x: width / 2,
  y: 450,
  vx: 0,
  vy: 0,
  hp: 5,
  maxhp: 5,
  attack: 2,
  active: true,
};
