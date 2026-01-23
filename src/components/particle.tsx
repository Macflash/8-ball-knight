import { BallEl } from "./ball";
import { explosionPng } from "../images/misc/misc";
import { Particle } from "../game/levels/particle";

export function ParticleEl({ particle }: { particle: Particle }) {
  if (particle.lifespan <= 0) return null;
  return (
    <BallEl ball={particle}>
      <img
        style={{ position: "absolute" }}
        src={particle.image}
        height={particle.r * 4}
      />
    </BallEl>
  );
}
