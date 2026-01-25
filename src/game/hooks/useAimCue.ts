import React from "react";
import { playBallDrop } from "../../sounds/audio";
import {
  fromCueAngle,
  scale,
  add,
  vec,
  distance,
  Vec,
  angleFromAtoB,
} from "../physics/vec";
import { isAiming, TurnStage } from "../types/turn";
import { Hero } from "../types/hero";

export interface StickState {
  aimDir: number;
  charge: number;
  isCharging: boolean;
}

export function useAimCue() {
  const [aimDir, setAimDir] = React.useState(0);

  const [isCharging, setIsCharging] = React.useState(false);

  const [startp, setStart] = React.useState(vec());
  const [releasep, setRelease] = React.useState<Vec | null>(null);

  // Set scale for where "maximum" charge distance will be.
  const scale = 100;

  // Charge is from 0 to 1.
  const charge = releasep
    ? (Math.atan(distance(startp, releasep) / scale) * 2) / Math.PI
    : 0;

  // TODO????
  // It would probably be COOL to have it so as you get faster max speed,
  // you need to pull back farther, so that for basic stuff the same distance back = the same speed.
  // But not REALLY critical, and could be a bit confusing?

  const reset = React.useCallback(() => {
    setIsCharging(false);
    setStart(vec());
    setRelease(null);
  }, [setIsCharging, setStart, setRelease]);

  // MOUSE MOVE HANDLERS

  const setStartOrRelease = React.useCallback(
    (mousep: Vec) => {
      if (isCharging) setRelease(mousep);
      else setStart(mousep);
    },
    [isCharging, setRelease, setStart],
  );

  const calculateAimDir = React.useCallback(
    (mousep: Vec, herop: Vec) => {
      if (isCharging) return; // Keep the same angle while pulling back.

      // UGH, I hate this part but... I guess we need to do it somewhere??
      const tEl = document.getElementById("game-table")!;
      const tablep = vec(tEl.offsetLeft, tEl.offsetTop);
      const cuep = add(tablep, herop);
      const angle = angleFromAtoB(mousep, cuep);
      const degrees = (angle * 180) / Math.PI;
      setAimDir(degrees + 90);
    },
    [isCharging, setAimDir],
  );

  const onMouseMove = React.useCallback(
    (mousep: Vec, herop: Vec) => {
      setStartOrRelease(mousep);
      calculateAimDir(mousep, herop);
    },
    [setStartOrRelease, calculateAimDir],
  );

  // MOUSE/KEY DOWN/UP HANDLERS

  const onMouseDown = React.useCallback(
    (hero: Hero) => {
      if (isAiming(hero)) setIsCharging(true);
    },
    [setIsCharging],
  );

  return {
    reset,
    aimDir,
    charge,
    isCharging,
    onMouseDown,
    setAimDir,
    onMouseMove,
  };
}
