import React from "react";
import { playBallDrop } from "../../sounds/audio";
import { fromCueAngle, scale, add, vec, distance, Vec } from "../physics/vec";
import { isAiming, TurnStage } from "../types/turn";

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

  return {
    reset,
    aimDir,
    charge,
    isCharging,
    setIsCharging,
    setAimDir,
    setStart,
    setRelease,
  };
}
