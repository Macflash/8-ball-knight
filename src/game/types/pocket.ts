import { Ball } from "../physics/ball";
import { Vec } from "../physics/vec";

export interface Pocket {
  pocket: true;
  p: Vec;
  r: number;

  explode?: number;

  images: Images;
  sounds: Sounds;

  blocked?: boolean;
}

interface Images {
  blocked: string;
  explode: string;
}

interface Sounds {
  pocket: string;
}
