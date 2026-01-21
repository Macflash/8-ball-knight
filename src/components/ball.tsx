import React from "react";
import { Ball } from "../game/physics/ball";
import { Vec } from "../game/physics/vec";

export function BallEl({
  ball,
  children,
  id,
  background,
}: {
  ball: { r: number; p: Vec };
  id?: string;
  children?: React.ReactNode;
  background?: string;
}) {
  return (
    <div
      id={id}
      style={{
        background,
        boxShadow: background ? `0 0 ${0.5 * ball.r}px ${background}` : "",
        position: "absolute",
        marginLeft: ball.p.x - ball.r,
        marginTop: ball.p.y - ball.r,
        height: ball.r * 2,
        width: ball.r * 2,
        borderRadius: ball.r,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
}
