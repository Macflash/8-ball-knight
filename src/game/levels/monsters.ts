import { hp } from "../types/hp";
import { Monster } from "../types/monster";
import { imgs as goblin_imgs } from "../../images/goblin/def";
import { imgs as orc_imgs } from "../../images/orc/def";
import { ball } from "../physics/ball";
import { goblin_sounds } from "../../sounds/audio";

// Monsters!
// 30 = default radius
// 50 = default mass

export const goblin: () => Monster = () => ({
  ...ball(30, 50),
  monster: true,

  images: goblin_imgs,
  sounds: goblin_sounds,

  h: hp(3),
  attack: 1,
  speed: 1,
  ranged: true,
});

export const orc: () => Monster = () => ({
  ...ball(30, 50),
  monster: true,

  images: orc_imgs,
  sounds: goblin_sounds,

  h: hp(5),
  attack: 2,
  speed: 0.5,
  ranged: false,
});
