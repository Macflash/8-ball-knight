import { width } from "../../balls";
import { Hero } from "../types/hero";
import { hp } from "../types/hp";
import { imgs } from "../../images/cue/def";
import { ball } from "../physics/ball";
import { vec } from "../physics/vec";
import { hero_sounds } from "../../sounds/audio";

// TODO: maybe only take like 1HP damage and lose a turn if you scratch
// EXCEPT last turn probably? MAYBE just on boss levels as it gets a bit annoying.
// 8 ball is a boss who you can't kill until all the other ones are dead.
// PROTECT mission? where you have helpers or maybe have to protect your own 8 ball?
// 8 ball could be a dark hero you unlock later or play as? like necromancer style?
export const Knight: () => Hero = () => ({
  ...ball(30, 50),
  hero: true,

  images: imgs,
  sounds: hero_sounds,

  h: hp(5),

  attack: 2,
  maxSpeed: 2,

  aimDirection: 0,
});
