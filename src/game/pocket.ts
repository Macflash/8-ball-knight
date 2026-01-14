import { Ball } from "../physics/ball";

export interface Pocket extends Ball {
  pocket: true;

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
