import { imgs as goblin_imgs } from "../images/goblin/def";
import { imgs as orc_imgs } from "../images/orc/def";

// Monsters!
export const goblin = {
  monster: true,
  color: "rgba(255,0,0,0.5)",
  imgs: goblin_imgs,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  hp: 3,
  maxhp: 3,
  attack: 1,
  speed: 1,
  ranged: true,
};

export const orc = {
  monster: true,
  color: "rgba(255,0,0,0.5)",
  imgs: orc_imgs,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  hp: 5,
  maxhp: 5,
  attack: 2,
  speed: 0.5,
};
