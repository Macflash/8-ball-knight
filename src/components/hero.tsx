import { Hero } from "../game/types/hero";
import { BallEl } from "./ball";
import { isAlive, isDead, isHurt } from "../game/types/hp";
import { isMoving } from "../game/physics/ball";
import { TurnStage } from "../game/types/turn";
import { StatusEl } from "./status";
import { stickPng } from "../images/misc/misc";

export function HeroEl({
  hero,
  won,
  aimDir,
}: {
  hero: Hero;
  won?: boolean;
  aimDir?: number;
}) {
  return (
    <BallEl
      ball={hero}
      id="game-cue"
      background={isAlive(hero) ? "white" : undefined}
      glow={isAlive(hero) && hero.turn ? "yellow" : undefined}
    >
      {isAlive(hero) ? <StatusEl {...hero} /> : null}
      {isAlive(hero) && !won ? <CueStick hero={hero} aimDir={aimDir} /> : null}
      <HeroImage hero={hero} won={won} />
    </BallEl>
  );
}

function HeroImage({ hero, won }: { hero: Hero; won?: boolean }) {
  if (isDead(hero)) return null;

  const { images } = hero;
  let image = images.normal;
  if (isHurt(hero)) image = images.hurt;
  if (isMoving(hero)) image = images.surprised;
  if (hero.turn == TurnStage.attack) image = images.attack;
  if (won) image = images.happy;
  if (!image) image = images.normal;

  return (
    <img
      style={{ marginTop: -0.1 * hero.r }}
      src={image}
      height={hero.r * 2.5}
    ></img>
  );
}

function CueStick({
  hero: { turn, r },
  aimDir = 0,
}: {
  hero: Hero;
  aimDir?: number;
}) {
  if (turn !== TurnStage.aim) return null;
  return (
    <img
      src={stickPng}
      height={r * 10}
      style={{
        position: "absolute",
        // Compensate for the image
        transform: `rotate(${aimDir}deg)
                    translate(${0 * r}px, ${6 * r}px)`,
        zIndex: 2,
      }}
    />
  );
}
