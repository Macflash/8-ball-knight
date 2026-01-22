import { explosionPng } from "../../images/misc";
import { Ball } from "../physics/ball";
import { vec, Vec } from "../physics/vec";

export interface Particle extends Ball {
  image: string;
  lifespan: number;

  // For moving/colliding particles
  collide?: boolean;
}

export function particle(particle?: Partial<Particle>): Particle {
  return {
    p: vec(),
    v: vec(),
    a: vec(),
    r: 30,
    m: 10,
    image: explosionPng,
    lifespan: 100,
    ...particle,
  };
}
