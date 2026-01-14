import { Ball } from "../physics/ball";
import { HP } from "./hp";
import { TurnStage } from "./turn";

export interface Monster extends Ball {
  monster: true;

  h: HP;

  attack: number;
  speed: number;
  ranged: boolean;

  images: MonsterImages;
  sounds: MonsterSounds;

  turn?: TurnStage;
}

export interface MonsterImages {
  attack: string;
  happy: string;
  hurt: string;
  normal: string;
  surprised: string;
}

export interface MonsterSounds {
  turn: string;
  attack: string;
  hurt: string;
}
