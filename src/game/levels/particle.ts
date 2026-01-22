import { explosionPng } from "../../images/misc";
import { vec, Vec } from "../physics/vec";

export interface Particle {
  p: Vec;
  r: number;
  image: string;
  lifespan: number;

  // For moving/colliding particles
  v?: Vec;
  collide?: boolean;
}

export function particle(particle?: Partial<Particle>): Particle {
  return {
    p: vec(),
    r: 30,
    image: explosionPng,
    lifespan: 100,
    ...particle,
  };
}
