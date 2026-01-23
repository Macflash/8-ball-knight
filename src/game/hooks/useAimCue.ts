import React from "react";
import { playBallDrop } from "../../sounds/audio";
import { fromCueAngle, scale, add } from "../physics/vec";
import { isAiming, TurnStage } from "../types/turn";

export function useAimCue() {
  //   const [aimDir, setAimDir] = React.useState(0);
  //   const [charge, setCharge] = React.useState(0);
  //   const [isCharging, setIsCharging] = React.useState(0);
  //   const shoot = React.useCallback(
  //     (roll = 0, side = 0, speed = 1) => {
  //       if (!isAiming(hero)) return;
  //       // shoot the cue ball
  //       hero.v = fromCueAngle(aimDir, hero.maxSpeed * speed);
  //       if (roll) hero.a = scale(hero.v, roll);
  //       if (side) {
  //         hero.a = add(
  //           hero.a,
  //           fromCueAngle(aimDir + side * 90, hero.maxSpeed * 2),
  //         );
  //       }
  //       hero.turn = TurnStage.attack;
  //       setLevel({ ...level });
  //       playBallDrop();
  //     },
  //     [level, setLevel, aimDir],
  //   );
}
