import { CueAttack } from "../levels/attack";
import { Ball } from "../physics/ball";
import { Energy } from "./energy";
import { HP } from "./hp";
import { TurnStage } from "./turn";

export interface Hero extends Ball {
  hero: true;

  h: HP;
  e: Energy; // TODO: add attack selection.

  attack: number;
  maxSpeed: number;

  images: HeroImages;
  sounds: HeroSounds;

  turn?: TurnStage;
  activeAttack?: CueAttack;

  knownAttacks: CueAttack[];

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
