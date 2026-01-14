import React from "react";
import { Hero } from "../game/types/hero";
import { BallEl } from "./ball";
import { isAlive, isDead, isHurt } from "../game/types/hp";
import { isMoving } from "../game/physics/ball";
import { TurnStage } from "../game/types/turn";
import { StatusEl } from "./status";
import { stickPng } from "../images/misc";

export function HeroEl({ hero }: { hero: Hero }) {
  return (
    <BallEl
      ball={hero}
      id="game-cue"
      background={isAlive(hero) && hero.turn ? "yellow" : undefined}
    >
      <StatusEl {...hero} />
      <CueStick {...hero} />
      <HeroImage hero={hero} />
    </BallEl>
  );
}

function HeroImage({ hero }: { hero: Hero }) {
  if (isDead(hero)) return null;

  const { images } = hero;
  let image = images.normal;
  if (isHurt(hero)) image = images.hurt;
  if (isMoving(hero)) image = images.surprised;
  if (isMoving(hero) && hero.turn == TurnStage.attack) image = images.attack;

  return (
    <img
      style={{ marginTop: -0.1 * hero.r }}
      src={image}
      height={hero.r * 2.5}
    ></img>
  );
}

function CueStick({ turn, r, aimDirection }: Hero) {
  if (turn !== TurnStage.aim) return null;
  return (
    <img
      src={stickPng}
      height={r * 10}
      style={{
        position: "absolute",
        transform: `rotate(${aimDirection - 41}deg) 
                    translate(-${4.15 * r}px, ${5 * r}px)`,
        zIndex: 2,
      }}
    />
  );
}
