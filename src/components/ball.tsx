import React from "react";
import { Ball } from "../game/physics/ball";
import { Vec } from "../game/physics/vec";

export function BallEl({
  ball,
  children,
  id,
  background,
  glow,
}: {
  ball: { r: number; p: Vec };
  id?: string;
  children?: React.ReactNode;
  glow?: string;
  background?: string;
}) {
  return (
    <div
      id={id}
      style={{
        background,
        boxShadow: glow ? `0 0 ${0.5 * ball.r}px ${glow}` : "",
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
