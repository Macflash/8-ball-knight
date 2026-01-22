import { Ball } from "../physics/ball";
import { HP } from "./hp";
import { TurnStage } from "./turn";

export interface Hero extends Ball {
  hero: true;

  h: HP;

  attack: number;
  maxSpeed: number;

  images: HeroImages;
  sounds: HeroSounds;

  turn?: TurnStage;

  scratched?: boolean;
  pocketedEnemy?: boolean;
}

export interface HeroImages {
  attack: string;
  happy: string;
  hurt: string;
  normal: string;
  surprised: string;
}

export interface HeroSounds {
  turn: string;
  attack: string;
  hurt: string;
}
